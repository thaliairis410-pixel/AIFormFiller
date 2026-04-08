import { toast } from "sonner";

export default async function getFormDefaultValues() {
  try {
    const response = await fetch("/api/default-values");
    return (await response.json()).data;
  } catch {
    toast.error("Failed to load default values");
  }
}
