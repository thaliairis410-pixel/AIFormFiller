import { Worker } from "node:worker_threads";
import { SubmissionStatus } from "../../../generated/prisma/enums";
import prisma from "../utils/prisma.util";
import queue from "../utils/queue.util";

export class QueuingService {
  private static workers: Worker[] = [];
  private static queue = queue();
  private static fetchingData = false;
  private static idleWorkers: Worker[] = [];
  private static pollInterval: ReturnType<typeof setInterval> | null = null;

  static async start() {
    if (QueuingService.workers.length) return;

    // Seed the queue before spawning workers
    await QueuingService.refill();

    for (let i = 0; i < 2; i++) {
      const workerPath = import.meta.resolve("../utils/worker.util.js");
      const worker = new Worker(
        `import('tsx/esm/api').then(({ register }) => { register(); import('${workerPath}'); })`,
        { eval: true },
      );

      QueuingService.workers.push(worker);

      worker.addListener("message", (msg: string) => {
        if (msg === "start") return;
        QueuingService.dispatch(worker);
      });

      worker.addListener("error", (err) => {
        console.error(`Worker error:`, err);
        QueuingService.idleWorkers.push(worker);
      });
    }

    // Kick all workers once after queue is seeded
    for (const worker of QueuingService.workers) {
      QueuingService.dispatch(worker);
    }

    // Poll every 30s to catch new submissions if all workers go idle
    QueuingService.pollInterval = setInterval(async () => {
      if (QueuingService.idleWorkers.length > 0) {
        await QueuingService.refill();
        QueuingService.drainIdle();
      }
    }, 30_000);
  }

  static stop() {
    if (QueuingService.pollInterval) {
      clearInterval(QueuingService.pollInterval);
      QueuingService.pollInterval = null;
    }
    for (const worker of QueuingService.workers) {
      worker.terminate();
    }
    QueuingService.workers = [];
    QueuingService.idleWorkers = [];
  }

  private static async dispatch(worker: Worker) {
    if (QueuingService.queue.empty) {
      await QueuingService.refill();
    }

    const data = QueuingService.queue.dequeue();

    if (!data) {
      // Nothing to process — park worker in idle pool
      QueuingService.idleWorkers.push(worker);
      return;
    }

    worker.postMessage(data);
  }

  private static drainIdle() {
    while (
      QueuingService.idleWorkers.length > 0 &&
      !QueuingService.queue.empty
    ) {
      const worker = QueuingService.idleWorkers.shift()!;
      QueuingService.dispatch(worker);
    }
  }

  private static async refill() {
    if (QueuingService.fetchingData) return;
    QueuingService.fetchingData = true;
    try {
      const data = await prisma.submission.findMany({
        where: { status: SubmissionStatus.PENDING },
      });
      for (const submission of data) {
        QueuingService.queue.enqueue(submission);
      }
    } finally {
      QueuingService.fetchingData = false;
    }
  }
}
