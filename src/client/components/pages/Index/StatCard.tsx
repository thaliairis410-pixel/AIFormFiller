import type { StatCardProps } from "../../../types";

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div
      style={{ background: `${color}22`, borderColor: `${color}55` }}
      className="p-6 rounded-xl border space-y-3"
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
};

export default StatCard;
