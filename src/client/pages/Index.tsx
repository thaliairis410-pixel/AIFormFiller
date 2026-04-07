import { useEffect, useState } from "react";
import RecentActivity from "../components/pages/Index/RecentActivity";
import Stats from "../components/pages/Index/Stats";
import type { StatsData } from "../types";

const Index = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    async function fetchStats() {
      if (timeout) {
        clearTimeout(timeout);
      }

      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        setData(json.data);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
        timeout = setTimeout(fetchStats, 5000);
      }
    }

    fetchStats();
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-400">
          {error ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Stats {...data} />
      <RecentActivity {...data} />
    </>
  );
};

export default Index;
