import { Mail, MailCheck, MailQuestion, MailWarning } from "lucide-react";
import StatCard from "../components/StatCard";
import { stats } from "../utils/demo";

const Index = () => {
	return (
		<>
			{/* Statistics */}
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
							value={stats?.contacted}
							icon={<MailQuestion fontSize="inherit" />}
							color="#ff9800"
						/>
						<StatCard
							title="Responded"
							value={stats?.responded}
							icon={<MailCheck fontSize="inherit" />}
							color="#4caf50"
						/>
						<StatCard
							title="Failed"
							value={stats?.failed}
							icon={<MailWarning fontSize="inherit" />}
							color="#f44336"
						/>
					</div>
				</div>
			</section>

			<section className="p-6">
				<div className="container space-y-6">
					<h2 className="text-2xl font-bold">Performance Overview</h2>

					<div className="grid grid-cols-2 gap-6">
						{/* Recent Activity */}
						<div className="space-y-3 border rounded-xl border-zinc-300 bg-white">
							<h4 className="text-lg font-bold p-6">Recent Activity</h4>

							<div>
								<div className="grid grid-cols-3 border-y border-zinc-300 font-semibold">
									<p className="py-2 px-6 border-r border-zinc-300">Date</p>
									<p className="py-2 px-6 border-r border-zinc-300">Sent</p>
									<p className="py-2 px-6">Responses</p>
								</div>
								{stats.weeklyActivity.map((activity) => (
									<div
										className="grid grid-cols-3 not-last-of-type:border-b border-zinc-300 hover:bg-zinc-50"
										key={activity.date}
									>
										<p className="py-2 px-6 border-r border-zinc-300">
											{activity.date}
										</p>
										<p className="py-2 px-6 text-right border-r border-zinc-300">
											{activity.sent}
										</p>
										<p className="py-2 px-6 text-right">{activity.responses}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Index;
