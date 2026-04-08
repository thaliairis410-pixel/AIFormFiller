export default function getStatusColor(status: string) {
  if (status === "SUCCESS") {
    return "text-green-600";
  } else if (status === "PENDING") {
    return "text-yellow-600";
  } else if (status === "IN_PROGRESS") {
    return "text-blue-600";
  } else {
    return "text-red-600";
  }
}
