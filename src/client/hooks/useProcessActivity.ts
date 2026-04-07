import { create } from "zustand";
import type { ProcessActivity } from "../types";

const useProcessActivity = create<ProcessActivity>((set) => ({
  total: 0,
  contacted: 0,
  failed: 0,
  queue: null,
  page: 1,
  setPage(page) {
    set({ page });
  },
  setQueue(queue) {
    set({
      queue,
      contacted: queue.filter((it) => it.status !== "PENDING").length,
      failed: queue.filter((it) => it.status === "FAILED").length,
      total: queue.length,
    });
  },
}));

export default useProcessActivity;
