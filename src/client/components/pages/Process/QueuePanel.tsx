import type { QueueItem } from "../../../types";
import getStatusBg from "../../../utils/get-status-bg";
import getStatusColor from "../../../utils/get-status-color";

export default function QueuePanel({ updates }: { updates?: QueueItem[] }) {
  return (
    <div className="bg-white border border-zinc-300 p-6 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Processing Queue</h3>
        {updates && updates.length > 0 && (
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            {updates.length} domain{updates.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {!updates || updates.length === 0 ? (
        <div className="my-12 text-sm text-zinc-400 text-center">
          Nothing in queue. Upload a file to begin.
        </div>
      ) : (
        <div className="space-y-2 max-h-130 overflow-y-auto pr-1">
          {updates.map((item) => (
            <div
              key={item.id}
              className={`flex justify-between items-center p-3 rounded-lg ring-1 ${getStatusBg(item.status)}`}
            >
              <div className="text-sm text-zinc-700 truncate">
                {item.domain}
              </div>
              <div
                className={`text-xs font-semibold ml-4 shrink-0 ${getStatusColor(item.status)}`}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
