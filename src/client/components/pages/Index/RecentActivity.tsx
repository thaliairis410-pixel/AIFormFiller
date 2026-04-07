import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { StatsData } from "../../../types";
import getStatusColor from "../../../utils/get-status-color";

const RecentActivity = ({ recentActivity }: StatsData) => {
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <section className="p-6">
      <div className="container space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Link
            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md inline-flex items-center gap-2 hover:bg-blue-700 transition"
            to="/history"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="border border-zinc-300 bg-white rounded-2xl p-12 text-center text-sm text-zinc-400">
            No recent activity found.
          </div>
        ) : (
          <div className="border border-zinc-300 bg-white rounded-2xl overflow-auto">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr] border-b border-zinc-300 font-semibold text-sm min-w-[540px]">
              <p className="py-3 px-6 border-r border-zinc-300">ID</p>
              <p className="py-3 px-6 border-r border-zinc-300">Domain</p>
              <p className="py-3 px-6 border-r border-zinc-300">Status</p>
              <p className="py-3 px-6">Created</p>
            </div>

            <div className="min-w-[540px]">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr] odd:bg-zinc-50 not-last-of-type:border-b border-zinc-300 hover:bg-zinc-100 transition text-sm"
                >
                  <p className="py-3 px-6 border-r border-zinc-300 font-mono text-zinc-500 truncate">
                    {item.id}
                  </p>
                  <p className="py-3 px-6 border-r border-zinc-300 truncate">
                    <a
                      href={`https://${item.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.domain}
                    </a>
                  </p>
                  <p
                    className={`py-3 px-6 border-r border-zinc-300 font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status}
                  </p>
                  <p className="py-3 px-6 text-zinc-500 truncate">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentActivity;
