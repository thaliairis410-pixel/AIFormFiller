export interface StatCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
	color: string;
}

export interface Activity {
	id: string;
	domain: string;
	contactEmail: string;
	time: string;
	timestamp: Date;
	duration: string;
	responded: boolean;
	status: "success" | "failed" | "processing" | "pending";
	responseTime?: string;
	attempts: number;
	message: string;
}
