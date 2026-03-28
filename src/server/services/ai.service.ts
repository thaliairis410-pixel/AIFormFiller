import { generateText } from "ai";
import "dotenv/config";
import getContactPageDetectionSysMsg from "../utils/get-contact-page-detection-sys-msg.js";
import getSubmissionDetectionSysMsg from "../utils/get-submission-detection-sys-msg.js";

export default abstract class AI {
  private static baseModel = "google/gemini-2.5-flash-lite-preview-09-2025";

  private static clean(text: string) {
    return text.replace(/```json|```/g, "").trim();
  }

  static async findContactPageUrl(domain: string, html: string) {
    const response = await generateText({
      model: AI.baseModel,
      system: await getContactPageDetectionSysMsg(),
      prompt: JSON.stringify({ domain, html }),
    });

    return AI.clean(response.text);
  }

  private static submissionDetectionSysMsg = getSubmissionDetectionSysMsg();

  static async detectFormSubmissionResult(input: {
    text: string;
    url: string;
  }) {
    const response = await generateText({
      model: AI.baseModel,
      system: AI.submissionDetectionSysMsg,
      prompt: JSON.stringify(input),
    });

    return AI.clean(response.text);
  }
}
