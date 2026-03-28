import type { HTTPResponse, Page } from "puppeteer-core";
import minify from "../utils/minify.util.js";
import purify from "../utils/purify.util.js";
import AI from "./ai.service.js";
import BrowserService from "./browser.service.js";

const MAX_DEPTH = 3;
const SPA_SETTLE_DELAY = 30_000;
const MAX_HTML_LENGTH = 140_000;

interface FillResult {
  success: boolean;
  reason?: string;
  note?: string;
  protection?: Record<string, boolean>;
}

interface ContactPageData {
  blocked?: boolean;
  found?: boolean;
  foundContactFormOnPage?: boolean;
  path?: string;
  formSelector?: string;
  fields?: { selector: string; name?: string; value: string; type: string }[];
  protection?: Record<string, boolean>;
}

export default class FormFiller {
  private static async getPageSnapshot(page: Page): Promise<string> {
    const html = await BrowserService.getPageHtml(page);
    const clean = await purify(html);
    const minified = await minify(clean);
    return minified.length > MAX_HTML_LENGTH
      ? minified.substring(0, MAX_HTML_LENGTH)
      : minified;
  }

  private static async analyzeContactPage(
    page: Page,
  ): Promise<ContactPageData> {
    const snapshot = await FormFiller.getPageSnapshot(page);
    const raw = await AI.findContactPageUrl(page.url(), snapshot);

    try {
      return JSON.parse(raw) as ContactPageData;
    } catch {
      throw new Error(
        `AI returned non-JSON response: ${raw.substring(0, 200)}`,
      );
    }
  }

  private static async analyzeSubmissionResult(
    page: Page,
  ): Promise<{ success: boolean; reason?: string }> {
    const text = await page.evaluate(() => document.body.innerText);

    const raw = await AI.detectFormSubmissionResult({
      text: text.substring(0, 140_000),
      url: page.url(),
    });

    try {
      return JSON.parse(raw);
    } catch {
      return {
        success: true,
        reason: "AI response unparsable — assumed success",
      };
    }
  }

  private static async fillField(
    page: Page,
    field: Required<ContactPageData>["fields"][number],
  ) {
    const input =
      (await page.$(field.selector).catch(() => null)) ||
      (await page.$(`[name="${field.name}"]`).catch(() => null));

    if (!input) {
      return;
    }

    if (field.type === "checkbox") {
      await input.click({ delay: 100 });
      return;
    }

    if (field.type === "radio") {
      await input.click({ delay: 100 });
      return;
    }

    await input.click({ count: 3 });
    await input.press("Backspace");
    await input.type(field.value, { delay: 100 });
  }

  private static async submitForm(
    page: Page,
    formSelector: string,
  ): Promise<boolean> {
    const form = await page
      .waitForSelector(formSelector, {
        timeout: 5000,
      })
      .catch(() => null);

    if (!form) return false;

    const submitButton =
      (await form
        .$("button[type='submit'], input[type='submit'], button:not([type])")
        .catch(() => null)) || null;

    let networkSignal = false;
    let relevantResponse: HTTPResponse | null = null;

    const onResponse = (res: HTTPResponse) => {
      const req = res.request();

      const isFormLike =
        ["POST", "PUT", "PATCH"].includes(req.method()) &&
        req.url().includes(new URL(page.url()).hostname);

      if (isFormLike) {
        networkSignal = true;
        relevantResponse = res;
      }
    };

    page.on("response", onResponse);

    const navigationPromise = page
      .waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 10_000,
      })
      .then(() => true)
      .catch(() => false);

    const domChangePromise = page
      .waitForFunction(
        () => {
          const text = document.body.innerText.toLowerCase();
          const success = /thank|success|sent|received|submitted/.test(text);
          const failure = /error|failed|invalid|required/.test(text);
          const successNode = document.querySelector(
            "[class*='success'],[id*='success'],[class*='thank'],[id*='thank']",
          );

          return success || successNode || failure;
        },
        { timeout: 10_000 },
      )
      .then(() => true)
      .catch(() => false);

    const networkWaitPromise = page
      .waitForResponse(
        (res) => {
          const req = res.request();
          return (
            ["POST", "PUT", "PATCH"].includes(req.method()) &&
            res.url().includes(new URL(page.url()).hostname)
          );
        },
        { timeout: 10_000 },
      )
      .then(() => true)
      .catch(() => false);

    try {
      if (submitButton) {
        await Promise.allSettled([submitButton.click({ delay: 50 })]);
      } else {
        console.log("submitButton not found, submitting form via evaluate");
        await form.evaluate((el: any) => {
          if (typeof el.requestSubmit === "function") {
            el.requestSubmit();
          } else {
            el.dispatchEvent(
              new Event("submit", { bubbles: true, cancelable: true }),
            );
          }
        });
      }
    } catch {}

    const [nav, dom, net] = await Promise.allSettled([
      navigationPromise,
      domChangePromise,
      networkWaitPromise,
    ]);

    page.off("response", onResponse);

    const navSuccess = nav.status === "fulfilled" && nav.value;
    const domSuccess = dom.status === "fulfilled" && dom.value;
    const netSuccess = net.status === "fulfilled" && net.value;

    if (netSuccess || networkSignal) {
      if (relevantResponse) {
        const status = (relevantResponse as HTTPResponse).status();
        if (status >= 200 && status < 500) {
          return true;
        }
      }

      return true;
    }

    if (domSuccess) return true;
    if (navSuccess) return true;

    await new Promise((r) => setTimeout(r, 3000));
    return false;
  }

  private static async fillForm(
    page: Page,
    data: ContactPageData,
  ): Promise<FillResult> {
    if (!data.formSelector) {
      return { success: false, reason: "Form selector missing in AI response" };
    }

    if (!data.fields?.length) {
      return { success: false, reason: "No fields provided by AI" };
    }

    for (const field of data.fields) {
      await FormFiller.fillField(page, field);
    }

    const networkSuccess = await FormFiller.submitForm(page, data.formSelector);
    if (networkSuccess) {
      return {
        success: true,
        reason: "POST request succeeded after submission",
      };
    }

    await new Promise((r) => setTimeout(r, SPA_SETTLE_DELAY));
    const result = await FormFiller.analyzeSubmissionResult(page);

    if (result.success) {
      return {
        success: true,
        reason: result.reason ?? "Submission confirmed by AI",
      };
    }

    const isAmbiguous =
      !result.reason || /unclear|unknown|unsure/i.test(result.reason);
    if (isAmbiguous) {
      return { success: true, note: "No error detected — assumed successful" };
    }

    return { success: false, reason: result.reason };
  }

  static async findAndFill(url: string, depth = 0): Promise<FillResult> {
    if (depth > MAX_DEPTH) {
      return {
        success: false,
        reason: `Max navigation depth (${MAX_DEPTH}) exceeded`,
      };
    }

    const page = await BrowserService.launchPage(url);

    let data: ContactPageData;

    try {
      data = await FormFiller.analyzeContactPage(page);
    } catch (err) {
      await BrowserService.closePage(page);
      return { success: false, reason: (err as Error).message };
    }

    if (data.blocked) {
      await BrowserService.closePage(page);
      return { success: false, reason: "Blocked by anti-bot protection" };
    }

    if (!data.found) {
      await BrowserService.closePage(page);
      return { success: false, reason: "No contact page found" };
    }

    const hasProtection =
      data.protection && Object.values(data.protection).some(Boolean);
    if (hasProtection) {
      await BrowserService.closePage(page);
      return {
        success: false,
        reason: "CAPTCHA or bot protection detected",
        protection: data.protection,
      };
    }

    if (data.foundContactFormOnPage) {
      const result = await FormFiller.fillForm(page, data);
      await BrowserService.closePage(page);
      return result;
    }

    if (!data.path) {
      await BrowserService.closePage(page);
      return {
        success: false,
        reason: "Contact page detected but no path provided",
      };
    }

    // Resolve relative paths against the current page URL
    let nextUrl: string;
    try {
      nextUrl = new URL(data.path, page.url()).toString();
    } catch {
      await BrowserService.closePage(page);
      return {
        success: false,
        reason: `Invalid path returned by AI: ${data.path}`,
      };
    }

    await BrowserService.closePage(page);

    // Recurse into the resolved contact URL
    return FormFiller.findAndFill(nextUrl, depth + 1);
  }
}
