import { useEffect, useState } from "react";
import Pagination from "../components/pages/History/Pagination";
import Table from "../components/pages/History/Table";
import useProcessActivity from "../hooks/useProcessActivity";
import type { HistoryResponse } from "../types";

const LIMIT = 20;

export default function History() {
  const { page, setQueue } = useProcessActivity();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/status?page=${page}&limit=${LIMIT}`);
        const json: HistoryResponse = await res.json();
        setTotal(json.data.total);
        setQueue(json.data.queue);
      } catch {
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page, setQueue]);

  return (
    <section className="p-6">
      <div className="container space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">History</h2>
            {!loading && !error && (
              <p className="text-sm text-zinc-400 mt-0.5">
                {total.toLocaleString()} total record{total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Table */}
        <Table loading={loading} error={error || ""} />

        {!loading && !error && totalPages > 1 && (
          <Pagination totalPages={totalPages} />
        )}
      </div>
    </section>
  );
}
