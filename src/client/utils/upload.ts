import { toast } from "sonner";

export default async function upload(
  e: any,
  onSuccess: (domains: string[]) => void,
) {
  try {
    const form = new FormData(e.target);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
    const data = await response.json();

    if (data.success) {
      toast.success(
        "The domains have been submitted and queued form processing",
      );
      onSuccess(data.data.domains);
    } else {
      toast.error(data.error || "Failed to submit domains for processing");
    }
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    } else {
      toast.error(
        "Something went wrong. Please check your inputs and network connection.",
      );
    }
  }
}
