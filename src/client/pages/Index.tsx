import PerformanceOverview from "../components/pages/Index/PerformanceOverview";
import RecentActivity from "../components/pages/Index/RecentActivity";
import Stats from "../components/pages/Index/Stats";

const Index = () => {
	return (
		<>
			<Stats />
			<RecentActivity />
			<PerformanceOverview />
		</>
	);
};

export default Index;
