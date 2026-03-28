import { parentPort } from "node:worker_threads";
import { SubmissionStatus } from "../../../generated/prisma/enums.js";
import FormFiller from "../services/form-filler.service.js";
import prisma from "./prisma.util.js";

parentPort?.postMessage("start");

parentPort?.on("message", async (data: any) => {
  if (!data || data.status === SubmissionStatus.IN_PROGRESS) {
    parentPort?.postMessage("next");
    return;
  }

  try {
    await prisma.submission.update({
      where: { id: data.id },
      data: { status: SubmissionStatus.IN_PROGRESS },
    });

    const result = await FormFiller.findAndFill(data.domain);
    await prisma.submission.update({
      where: { id: data.id },
      data: {
        status: result.success
          ? SubmissionStatus.SUCCESS
          : SubmissionStatus.FAILED,
        failureReason: result.reason || result.note,
      },
    });
  } catch (error) {
    await prisma.submission.update({
      where: { id: data.id },
      data: {
        status: SubmissionStatus.FAILED,
        failureReason: error instanceof Error ? error.message : String(error),
      },
    });
  } finally {
    parentPort?.postMessage("next");
  }
});
