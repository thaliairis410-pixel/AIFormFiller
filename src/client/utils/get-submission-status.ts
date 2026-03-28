export default async function getSubmissionStatus(config: {
  page?: number;
  limit?: number;
  domains?: string[];
}) {
  try {
    const response = await fetch("/api/status", {
      method: "POST",
      body: JSON.stringify(config),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (!data.success) {
      return null;
    }
    return data.data;
  } catch {
    return null;
  }
}
