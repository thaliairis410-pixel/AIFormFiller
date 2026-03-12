import { Mail, MailCheck, MailQuestion, MailWarning } from "lucide-react";
import StatCard from "../components/StatCard";
import { stats } from "../utils/demo";

const Index = () => {
	return (
		<>
			{/* Statistics */}
			<section className="p-6">
				<div className="container space-y-6">
					<h1 className="text-2xl font-bold">Dashboard</h1>

					<div className="grid gap-6 grid-cols-4">
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

			<section></section>
		</>
	);
};

export default Index;
