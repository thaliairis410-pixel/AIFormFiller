import type { Request, Response } from "express";
import formidable from "formidable";
import ApiService from "../services/api.service.js";

export default class ApiController {
  static async handleUpload(req: Request, res: Response) {
    const form = formidable({});

    try {
      const [fields, files] = await form.parse(req);
      res.send(await ApiService.handleUpload(files, fields));
    } catch {
      res
        .status(500)
        .json({ success: false, error: "Failed to parse form data" });
    }
  }

  static async getSubmissionStatus(req: Request, res: Response) {
    const { domains } = (req.body || {}) as {
      domains?: string[];
    };
    const { page, limit } = (req.query || {}) as {
      page?: number;
      limit?: number;
    };
    res.json(await ApiService.getSubmissionStatus({ page, limit, domains }));
  }

  static async getStats(_: Request, res: Response) {
    res.json(await ApiService.getStats());
  }

  static async getDefaultFormValues(_: Request, res: Response) {
    res.json(await ApiService.getDefaultFormValues());
  }
}
