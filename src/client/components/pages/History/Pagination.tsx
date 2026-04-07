import { ChevronLeft, ChevronRight } from "lucide-react";
import useProcessActivity from "../../../hooks/useProcessActivity";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const { page, setPage } = useProcessActivity();

  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-zinc-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={14} /> Prev
        </button>

        {/* Page number pills */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
            )
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                acc.push("...");
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx as unknown}`}
                  className="px-1 text-zinc-400"
                >
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
        </div>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
