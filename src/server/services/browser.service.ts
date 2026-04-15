import puppeteer, { type Browser, type Page } from "puppeteer";

export default class BrowserService {
  private static browser: Browser | null = null;

  private static async launchBrowser() {
    if (!BrowserService.browser?.connected) {
      BrowserService.browser = await puppeteer.launch({
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

  private static isPermanentError(message: string): boolean {
    const permanentErrors = [
      "net::ERR_NAME_NOT_RESOLVED",
      "net::ERR_ADDRESS_UNREACHABLE",
      "net::ERR_INVALID_URL",
      "net::ERR_UNKNOWN_URL_SCHEME",
    ];

    return permanentErrors.some((err) => message.includes(err));
  }

  private static async safeGoto(
    page: Page,
    url: string,
    retries = 2,
    delayMs = 1000,
  ): Promise<void> {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
    } catch (err) {
      const error = err as Error;
      const errorMsg = error.message;

      // Check for permanent failures
      if (BrowserService.isPermanentError(errorMsg)) {
        throw new Error(`Network error (permanent): ${errorMsg}`);
      }

      // Retry logic for temporary failures
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
        return await BrowserService.safeGoto(
          page,
          url,
          retries - 1,
          Math.min(delayMs * 1.5, 10000), // Exponential backoff, max 10s
        );
      }

      throw new Error(`Navigation failed after retries: ${errorMsg}`);
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
