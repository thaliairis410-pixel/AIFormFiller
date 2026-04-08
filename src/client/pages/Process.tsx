import { useEffect, useState } from "react";
import { toast } from "sonner";
import Form from "../components/pages/Process/Form";
import QueuePanel from "../components/pages/Process/QueuePanel";
import type { QueueItem } from "../types";
import getSubmissionStatus from "../utils/get-submission-status";

const Process = () => {
  const [domains, setDomains] = useState<string[]>();
  const [updates, setUpdates] = useState<QueueItem[]>();

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    async function getLiveUpdates() {
      if (timeout) clearTimeout(timeout);

      const updates: QueueItem[] | null = await getSubmissionStatus({
        domains: domains,
      });

      if (updates === null) {
        toast.warning("Failed to fetch live updates. Retrying in 5s...");
      } else {
        setUpdates(updates);
      }

      timeout = setTimeout(getLiveUpdates, 5000);
    }

    if (domains?.length) {
      getLiveUpdates();
    }

    return () => clearTimeout(timeout);
  }, [domains]);

  return (
    <section className="p-6">
      <div className="container space-y-6">
        <h2 className="text-2xl font-bold md:sticky top-24">Process Emails</h2>

        <div className="container grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form setDomains={setDomains} />
          <QueuePanel updates={updates} />
        </div>
      </div>
    </section>
  );
};

export default Process;
