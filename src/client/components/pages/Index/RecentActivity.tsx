import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { recentActivity } from "../../../utils/demo";

const RecentActivity = () => {
  const headings = Object.keys(recentActivity[0]);

  const getStatusColor = (status: string): string => {
    if (status === "success") {
      return "text-green-600";
    } else if (status === "pending") {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <section className="p-6">
      <div className="container space-y-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Link
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md inline-flex items-center gap-2"
            to="/history"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="border border-zinc-300 bg-white rounded-2xl overflow-auto">
          <div
            style={{
              gridTemplateColumns: `repeat(${headings.length}, minmax(100px, 1fr))`,
            }}
            className="grid border-b border-zinc-300 font-semibold min-w-fit"
          >
            {headings.map((heading) => (
              <p
                key={heading}
                className="capitalize py-2 px-6 not-last-of-type:border-r border-zinc-300"
              >
                {heading}
              </p>
            ))}
          </div>

          <div className="min-w-fit">
            {recentActivity.map((activity) => (
              <div
                style={{
                  gridTemplateColumns: `repeat(${headings.length}, minmax(100px, 1fr))`,
                }}
                className="grid min-w-full odd:bg-zinc-100 not-last-of-type:border-b border-zinc-300 hover:bg-zinc-200 transition *:whitespace-nowrap *:overflow-hidden *:text-ellipsis"
                key={activity.id}
              >
                <p className="py-2 px-6 border-r border-zinc-300">
                  {activity.id}
                </p>
                <p className="py-2 px-6 border-r border-zinc-300">
                  <a
                    href={`mailto:${activity.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {activity.email}
                  </a>
                </p>
                <p className="py-2 px-6 border-r border-zinc-300">
                  <a
                    href={activity.domain}
                    className="text-blue-600 hover:underline"
                  >
                    {activity.domain}
                  </a>
                </p>
                <p
                  className={`${getStatusColor(activity.status)} capitalize py-2 px-6 border-r border-zinc-300`}
                >
                  {activity.status}
                </p>
                <p className="py-2 px-6 border-r border-zinc-300">
                  {activity.time}
                </p>
                <p className="py-2 px-6">{activity.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentActivity;
