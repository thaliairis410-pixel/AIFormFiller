import type { QueueItem } from "../types";

export default function getStatusBg(status: QueueItem["status"]) {
  if (status === "IN_PROGRESS") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (status === "SUCCESS") return "bg-green-50 text-green-700 ring-green-200";
  if (status === "PENDING")
    return "bg-yellow-50 text-yellow-700 ring-yellow-200";
  return "bg-red-50 text-red-700 ring-red-200";
}
