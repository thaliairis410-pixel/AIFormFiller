import { appendFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import type formidable from "formidable";
import {
  type Submission,
  SubmissionStatus,
  type SystemConfig,
} from "../../../generated/prisma/client.js";
import prisma from "../utils/prisma.util.js";
import processDomains from "../utils/process-domains.util.js";

export default class ApiService {
  static async handleUpload(
    files: formidable.Files,
    fields: formidable.Fields,
  ) {
    try {
      const parsedFields = {} as Partial<SystemConfig>;
      Object.keys(fields).forEach((key) => {
        parsedFields[key as keyof SystemConfig] = fields[key]?.[0] || "";
      });

      const parsedFiles = Object.values(files).flat();
      let domains: string[] = [];

      if (parsedFiles.length) {
        domains = (
          await Promise.all(
            parsedFiles.map(async (file) =>
              file ? processDomains(await readFile(file.filepath, "utf8")) : "",
            ),
          )
        ).flat();
      }

      const { id } = parsedFields;
      delete parsedFields.id;

      await Promise.all([
        prisma.systemConfig.update({
          where: { id },
          data: parsedFields,
        }),
        prisma.submission.createMany({
          data: domains.map((domain) => ({
            status: "PENDING",
            domain,
          })),
        }),
      ]);

      return { success: true, data: { domains, fields: parsedFields } };
    } catch (error) {
      await appendFile(
        join(
          process.cwd(),
          "logs",
          `failed_upload-${new Date().toDateString()}.txt`,
        ),
        `Failed to process upload at ${new Date().toISOString()}\n${error}`,
        "utf-8",
      );
      return { success: false, error: "Failed to process upload" };
    }
  }

  static async getSubmissionStatus({
    page,
    limit,
    domains,
  }: Partial<{
    page: number;
    limit: number;
    domains: string[];
  }>) {
    try {
      if (domains) {
        const data = await prisma.submission.findMany({
          where: { domain: { in: domains } },
        });
        return { success: true, data };
      }

      const LIMIT = Number(limit) || 100;
      const PAGE = Number(page) || 1;

      const [total, queue] = await Promise.all([
        prisma.submission.count(),
        prisma.submission.findMany({
          take: LIMIT,
          skip: (PAGE - 1) * LIMIT,
        }),
      ]);

      return { success: true, data: { total, queue } };
    } catch (error) {
      await appendFile(
        join(
          process.cwd(),
          "logs",
          `failed_fetch-${new Date().toDateString()}.txt`,
        ),
        `Failed to fetch submission data at ${new Date().toISOString()}\n${error}`,
        "utf-8",
      );
      return { success: false, error: "Failed to fetch submission data" };
    }
  }

  async updateSubmissionStatus(
    domains: string[],
    updates: Pick<Submission, "status" | "failureReason">,
  ) {
    try {
      const { count } = await prisma.submission.updateMany({
        where: { domain: { in: domains } },
        data: updates,
      });
      return { success: true, data: { documentsAffected: count } };
    } catch (error) {
      await appendFile(
        join(
          process.cwd(),
          "logs",
          `failed_update-${new Date().toDateString()}.txt`,
        ),
        `Failed to update submission data at ${new Date().toISOString()}\nThe update:\n${updates}\nThe domains:\n${domains}\n${error}`,
        "utf-8",
      );
      return { success: false, error: "Failed to update submission data" };
    }
  }

  static async getStats() {
    try {
      const [total, successful, failed, contacted, recentActivityRaw] =
        await Promise.all([
          prisma.submission.count(),
          prisma.submission.count({
            where: { status: SubmissionStatus.SUCCESS },
          }),
          prisma.submission.count({
            where: { status: SubmissionStatus.FAILED },
          }),
          prisma.submission.count({
            where: { status: { not: SubmissionStatus.PENDING } },
          }),
          prisma.submission.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
          }),
        ]);

      const recentActivity = recentActivityRaw.map((item) => ({
        id: item.id,
        status: item.status,
        domain: item.domain,
        failureReason: item.failureReason || undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt?.toISOString(),
      }));

      return {
        success: true,
        data: {
          total,
          successful,
          failed,
          contacted,
          recentActivity,
        },
      };
    } catch (error) {
      await appendFile(
        join(
          process.cwd(),
          "logs",
          `failed_stats-${new Date().toDateString()}.txt`,
        ),
        `Failed to fetch stats at ${new Date().toISOString()}\n${error}`,
        "utf-8",
      );

      return { success: false, error: "Failed to fetch stats" };
    }
  }

  static async getDefaultFormValues() {
    try {
      const data = await prisma.systemConfig.findFirst();

      return {
        success: true,
        data,
      };
    } catch (error) {
      await appendFile(
        join(
          process.cwd(),
          "logs",
          `failed_sys_config_fetch-${new Date().toDateString()}.txt`,
        ),
        `Failed to fetch system config values at ${new Date().toISOString()}\n${error}`,
        "utf-8",
      );

      return { success: false, error: "Failed to fetch stats" };
    }
  }
}
