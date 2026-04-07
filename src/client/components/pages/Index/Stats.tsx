import { Mail, MailCheck, MailQuestion, MailWarning } from "lucide-react";
import type { StatsData } from "../../../types";
import StatCard from "./StatCard";

const Stats = (stats: StatsData) => {
  return (
    <section className="p-6">
      <div className="container space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Total Emails"
            value={stats.total}
            icon={<Mail fontSize="inherit" />}
            color="#2196f3"
          />
          <StatCard
            title="Contacted"
            value={stats.contacted}
            icon={<MailQuestion fontSize="inherit" />}
            color="#ff9800"
          />
          <StatCard
            title="Successful"
            value={stats.successful}
            icon={<MailCheck fontSize="inherit" />}
            color="#4caf50"
          />
          <StatCard
            title="Failed"
            value={stats.failed}
            icon={<MailWarning fontSize="inherit" />}
            color="#f44336"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
