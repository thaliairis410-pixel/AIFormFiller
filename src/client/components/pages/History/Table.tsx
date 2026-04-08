import useProcessActivity from "../../../hooks/useProcessActivity";
import formatDate from "../../../utils/format-date";
import getStatusBg from "../../../utils/get-status-bg";

export default function Table({
  loading,
  error,
}: {
  loading: boolean;
  error: string;
}) {
  const { queue } = useProcessActivity();

  if (!queue) {
    return null;
  }

  return (
    <div className="bg-white border border-zinc-300 rounded-2xl overflow-auto">
      <div className="grid grid-cols-[minmax(100px,1fr)_minmax(100px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,2fr)] border-b border-zinc-300 font-semibold text-sm min-w-175">
        <p className="py-3 px-6 border-r border-zinc-300">ID</p>
        <p className="py-3 px-6 border-r border-zinc-300">Domain</p>
        <p className="py-3 px-6 border-r border-zinc-300">Status</p>
        <p className="py-3 px-6 border-r border-zinc-300">Created</p>
        <p className="py-3 px-6">Failure Reason</p>
      </div>

      <div className="min-w-175">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-zinc-400">Loading...</span>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-sm text-red-400">{error}</div>
        ) : queue.length === 0 ? (
          <div className="py-20 text-center text-sm text-zinc-400">
            No records found.
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(100px,1fr)_minmax(100px,2fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(100px,2fr)] odd:bg-zinc-50 not-last-of-type:border-b border-zinc-300 hover:bg-zinc-100 transition text-sm"
            >
              <p className="py-3 px-6 border-r border-zinc-300 font-mono text-zinc-400 truncate">
                {item.id}
              </p>
              <p className="py-3 px-6 border-r border-zinc-300 truncate">
                <a
                  href={item.domain}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.domain}
                </a>
              </p>
              <p className="py-3 px-6 border-r border-zinc-300">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${getStatusBg(item.status)}`}
                >
                  {item.status}
                </span>
              </p>
              <p className="py-3 px-6 border-r border-zinc-300 text-zinc-500 truncate">
                {formatDate(item.createdAt)}
              </p>
              <p className="py-3 px-6 text-zinc-400 truncate italic">
                {item.failureReason ?? "—"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
