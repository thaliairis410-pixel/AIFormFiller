import path from "node:path";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

export default class BrowserService {
  private static browser: Browser | null = null;

  private static async launchBrowser() {
    if (!BrowserService.browser?.isConnected()) {
      BrowserService.browser = await puppeteer.launch({
        executablePath: path.resolve(process.cwd(), "./brave.exe"),
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-blink-features=AutomationControlled",
        ],
      });
    }

    return BrowserService.browser;
  }

  private static async closeBrowser() {
    if (BrowserService.browser) {
      try {
        await BrowserService.browser.close();
      } catch {}
      BrowserService.browser = null;
    }
  }

  static async launchPage(url: string) {
    const browser = await BrowserService.launchBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const type = req.resourceType();
        if (["image", "font", "media"].includes(type)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await BrowserService.safeGoto(page, url);

      return page;
    } catch (err) {
      await page.close().catch(() => {});
      throw err;
    }
  }

  private static async safeGoto(
    page: Page,
    url: string,
    retries = 2,
  ): Promise<void> {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    } catch (err) {
      // Retry on error
      if (retries > 0) {
        return await BrowserService.safeGoto(page, url, retries - 1);
      }
      throw err;
    }
  }

  static async closePage(page: Page) {
    try {
      if (!page.isClosed()) {
        await page.close();
      }
    } catch {}
  }

  static async getPageHtml(page: Page) {
    try {
      return await page.content();
    } catch {
      return "";
    }
  }
}
