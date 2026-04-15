import type { HTTPResponse, Page } from "puppeteer";
import minify from "../utils/minify.util.js";
import purify from "../utils/purify.util.js";
import AI from "./ai.service.js";
import BrowserService from "./browser.service.js";

const MAX_DEPTH = 3;
const SPA_SETTLE_DELAY = 5000;

interface ContactField {
  selector: string;
  name?: string;
  value: string;
  type: string;
}

interface ContactPageData {
  blocked?: boolean;
  found?: boolean;
  foundContactFormOnPage?: boolean;
  path?: string;
  formSelector?: string;
  fields?: ContactField[];
}

interface FillResult {
  success: boolean;
  reason?: string;
  note?: string;
}

export default class FormFiller {
  private static async getPageSnapshot(page: Page): Promise<string> {
    const html = await BrowserService.getPageHtml(page);
    const clean = await purify(html);
    return await minify(clean);
  }

  private static async analyzeContactPage(
    page: Page,
  ): Promise<ContactPageData> {
    const snapshot = await FormFiller.getPageSnapshot(page);
    const raw = await AI.findContactPageUrl(page.url(), snapshot);
    try {
      return JSON.parse(raw) as ContactPageData;
    } catch {
      throw new Error("AI returned invalid JSON structure.");
    }
  }

  /**
   * Fills a specific field.
   * We pass primitive strings to evaluate to prevent transpiler mangling errors.
   */
  private static async fillField(page: Page, field: ContactField) {
    // Resolve selector: if AI provided a selector use it, otherwise fallback to name attribute
    const cssSelector = field.selector || `[name="${field.name}"]`;
    const targetValue = field.value;
    const fieldType = field.type;

    const exists = await page
      .waitForSelector(cssSelector, { timeout: 3000 })
      .catch(() => null);

    if (!exists) {
      return;
    }

    if (fieldType === "checkbox") {
      await exists.evaluate((_el) => {
        const el = _el as HTMLInputElement;

        if (el.checked) {
          return;
        }

        el.checked = true;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
      });
    }

    if (fieldType === "radio") {
      await exists.click().catch(() => {});
      return;
    }

    // React/Vue-safe value injection
    await page.evaluate(
      (sel, val) => {
        const el = document.querySelector(sel) as HTMLInputElement | null;
        if (!el) {
          return;
        }

        el.value = val;
        // Trigger events so the site knows the data changed
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
      },
      cssSelector,
      targetValue,
    );
  }

  /**
   * Submits the form and monitors for network success (2xx POST/PUT)
   */
  private static async submitForm(
    page: Page,
    formSelector: string,
  ): Promise<boolean> {
    let isSuccess = false;

    const onResponse = (res: HTTPResponse) => {
      const method = res.request().method();
      if (["POST", "PUT", "PATCH"].includes(method)) {
        if (res.status() >= 200 && res.status() < 300) {
          isSuccess = true;
        }
      }
    };

    page.on("response", onResponse);

    try {
      await Promise.all([
        page.evaluate((sel) => {
          const f = document.querySelector(sel) as HTMLFormElement | null;
          if (!f) {
            return;
          }

          const btn = f.querySelector(
            "button[type='submit'], input[type='submit'], .submit-btn",
          ) as HTMLElement | null;

          if (btn) {
            btn.click();
          } else {
            f.requestSubmit?.();
          }
        }, formSelector),

        // Wait for a response or a page navigation as signs of submission
        page
          .waitForResponse(
            (res) => ["POST", "PUT", "PATCH"].includes(res.request().method()),
            { timeout: 10000 },
          )
          .catch(() => null),

        page
          .waitForNavigation({ waitUntil: "networkidle2", timeout: 8000 })
          .catch(() => null),
      ]);
    } catch {
    } finally {
      page.off("response", onResponse);
    }

    return isSuccess;
  }

  private static async fillForm(
    page: Page,
    data: ContactPageData,
  ): Promise<FillResult> {
    if (!data.formSelector || !data.fields?.length) {
      return { success: false, reason: "Form data missing" };
    }

    // Wait for inputs to be present
    await page
      .waitForFunction(
        () => document.querySelectorAll("input, textarea, select").length > 0,
        { timeout: 10000 },
      )
      .catch(() => {});

    for (const field of data.fields) {
      await FormFiller.fillField(page, field);
    }

    const networkConfirmed = await FormFiller.submitForm(
      page,
      data.formSelector,
    );

    if (networkConfirmed) {
      return { success: true, reason: "Confirmed via network activity" };
    }

    // Fallback: Check page content via AI to see if a "Thank You" message appeared
    await new Promise((r) => setTimeout(r, SPA_SETTLE_DELAY));

    const text = await page.evaluate(() => document.body.innerText);
    const aiResultRaw = await AI.detectFormSubmissionResult({
      text: text.substring(0, 100000),
      url: page.url(),
    });

    try {
      const parsed = JSON.parse(aiResultRaw);
      return {
        success: !!parsed.success,
        note: parsed.reason || "AI analysis of page state",
      };
    } catch {
      return { success: false, reason: "Verification failed" };
    }
  }

  static async findAndFill(url: string, depth = 0): Promise<FillResult> {
    if (depth > MAX_DEPTH) {
      return { success: false, reason: "Max depth reached" };
    }

    const page = await BrowserService.launchPage(url);

    try {
      const data = await FormFiller.analyzeContactPage(page);

      if (data.blocked) {
        return { success: false, reason: "Anti-bot detected" };
      }

      if (!data.found) {
        if (
          data.path &&
          new URL(data.path, url).pathname !== new URL(url).pathname
        ) {
          // Continue
        } else {
          return { success: false, reason: "Contact link not found" };
        }
      }

      if (data.path) {
        const nextUrl = new URL(data.path, page.url()).toString();
        // Crucial: Close current page before opening the next to prevent memory bloat
        await BrowserService.closePage(page);
        return await FormFiller.findAndFill(nextUrl, depth + 1);
      }

      if (data.foundContactFormOnPage) {
        return await FormFiller.fillForm(page, data);
      }

      return {
        success: false,
        reason: "Contact page identified but no form found",
      };
    } catch (err) {
      return { success: false, reason: (err as Error).message };
    } finally {
      if (!page.isClosed()) {
        await BrowserService.closePage(page);
      }
    }
  }
}
