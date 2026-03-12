import type { Activity } from "../types";

export const stats = {
	// Overview Stats
	total: 1250,
	contacted: 843,
	responded: 234,
	failed: 312,
	pending: 431,
	expired: 42,

	// Form Submission Stats
	successfulSubmissions: 567,
	failedSubmissions: 198,
	noFormFound: 276,
	duplicateAttempts: 42,

	// Website Stats
	failedWebsites: 145,
	websitesWithForms: 843,
	websitesWithoutForms: 276,

	// Timeline Data
	weeklyActivity: [
		{ date: "2024-01-01", sent: 45, responses: 12 },
		{ date: "2024-01-02", sent: 52, responses: 8 },
		{ date: "2024-01-03", sent: 38, responses: 15 },
		{ date: "2024-01-04", sent: 65, responses: 22 },
		{ date: "2024-01-05", sent: 71, responses: 18 },
		{ date: "2024-01-06", sent: 23, responses: 5 },
		{ date: "2024-01-07", sent: 15, responses: 3 },
	],

	// Monthly Trend
	monthlyTrend: [
		{ month: "Jan", sent: 245, responses: 52 },
		{ month: "Feb", sent: 278, responses: 61 },
		{ month: "Mar", sent: 312, responses: 78 },
		{ month: "Apr", sent: 298, responses: 65 },
		{ month: "May", sent: 345, responses: 82 },
		{ month: "Jun", sent: 367, responses: 91 },
	],

	// Status Distribution
	statusDistribution: [
		{ status: "Pending", count: 431, color: "#ff9800" },
		{ status: "Processing", count: 112, color: "#2196f3" },
		{ status: "Contacted", count: 843, color: "#4caf50" },
		{ status: "Responded", count: 234, color: "#9c27b0" },
		{ status: "Failed", count: 312, color: "#f44336" },
		{ status: "Expired", count: 42, color: "#757575" },
	],

	// Processing Stats
	processingSpeed: {
		averageTime: "45 seconds",
		fastest: "12 seconds",
		slowest: "3 minutes 24 seconds",
		queueLength: 23,
	},

	// Error Types
	errorBreakdown: [
		{ error: "No contact form found", count: 276 },
		{ error: "CAPTCHA detected", count: 89 },
		{ error: "Form submission failed", count: 67 },
		{ error: "Website timeout", count: 45 },
		{ error: "Invalid website", count: 34 },
		{ error: "Blocked by robots.txt", count: 23 },
	],

	// Success Rate Over Time
	successTrend: [
		{ date: "Week 1", rate: 65 },
		{ date: "Week 2", rate: 68 },
		{ date: "Week 3", rate: 71 },
		{ date: "Week 4", rate: 69 },
		{ date: "Week 5", rate: 73 },
		{ date: "Week 6", rate: 75 },
		{ date: "Week 7", rate: 74 },
		{ date: "Week 8", rate: 78 },
	],
};

// Detailed Recent Activity
export const recentActivity = [
	{
		id: 1,
		email: "contact@company1.com",
		domain: "company1.com",
		status: "success",
		time: "2 minutes ago",
		response: "Form submitted successfully",
		duration: "45s",
	},
	{
		id: 2,
		email: "info@business2.net",
		domain: "business2.net",
		status: "failed",
		time: "5 minutes ago",
		response: "No contact form found",
		duration: "23s",
	},
	{
		id: 3,
		email: "support@startup3.io",
		domain: "startup3.io",
		status: "processing",
		time: "7 minutes ago",
		response: "Filling form...",
		duration: "1m 12s",
	},
	{
		id: 4,
		email: "hello@agency4.com",
		domain: "agency4.com",
		status: "success",
		time: "12 minutes ago",
		response: "Message sent, auto-reply received",
		duration: "58s",
	},
	{
		id: 5,
		email: "contact@shop5.online",
		domain: "shop5.online",
		status: "captcha",
		time: "15 minutes ago",
		response: "CAPTCHA detected - skipped",
		duration: "34s",
	},
	{
		id: 6,
		email: "info@tech6.org",
		domain: "tech6.org",
		status: "success",
		time: "18 minutes ago",
		response: "Form submitted successfully",
		duration: "41s",
	},
	{
		id: 7,
		email: "admin@edu7.edu",
		domain: "edu7.edu",
		status: "pending",
		time: "22 minutes ago",
		response: "Queued for processing",
		duration: "0s",
	},
	{
		id: 8,
		email: "contact@gov8.gov",
		domain: "gov8.gov",
		status: "failed",
		time: "25 minutes ago",
		response: "Form submission failed - validation error",
		duration: "1m 34s",
	},
];

// Chart Data for Visualizations
export const chartData = {
	// Line chart for daily performance
	dailyPerformance: {
		labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		datasets: [
			{
				label: "Forms Submitted",
				data: [65, 72, 84, 78, 92, 45, 38],
				borderColor: "#2196f3",
			},
			{
				label: "Responses Received",
				data: [18, 22, 29, 24, 31, 12, 8],
				borderColor: "#4caf50",
			},
		],
	},

	// Pie chart for status distribution
	statusPieData: [
		{ name: "Successful", value: 567, color: "#4caf50" },
		{ name: "Failed", value: 312, color: "#f44336" },
		{ name: "No Form", value: 276, color: "#ff9800" },
		{ name: "Pending", value: 431, color: "#9e9e9e" },
	],

	// Bar chart for top domains
	topDomainsChart: {
		labels: ["Gmail", "Yahoo", "Outlook", "Company", "Business", "Org"],
		data: [342, 156, 134, 98, 76, 54],
	},
};

// Summary Metrics
export const summaryMetrics = {
	today: {
		submitted: 45,
		responses: 12,
		failed: 8,
		rate: "26.7%",
	},
	thisWeek: {
		submitted: 312,
		responses: 78,
		failed: 45,
		rate: "25.0%",
	},
	thisMonth: {
		submitted: 1250,
		responses: 312,
		failed: 178,
		rate: "24.9%",
	},
	allTime: {
		submitted: 5432,
		responses: 1432,
		failed: 876,
		rate: "26.3%",
	},
};

// frontend/src/data/simpleDomainsData.ts

export const simpleDomainsData: Activity[] = [
	{
		id: "MSG-001",
		domain: "techstartup.io",
		contactEmail: "contact@techstartup.io",
		time: "2 minutes ago",
		timestamp: new Date(Date.now() - 2 * 60000),
		duration: "45s",
		responded: true,
		status: "success",
		responseTime: "5m",
		attempts: 1,
		message: "Inquiry about enterprise software solutions",
	},
	{
		id: "MSG-002",
		domain: "globalsolutions.net",
		contactEmail: "info@globalsolutions.net",
		time: "5 minutes ago",
		timestamp: new Date(Date.now() - 5 * 60000),
		duration: "1m 23s",
		responded: false,
		status: "failed",
		attempts: 2,
		message: "Failed: CAPTCHA detected",
	},
	{
		id: "MSG-003",
		domain: "creativeagency.com",
		contactEmail: "hello@creativeagency.com",
		time: "8 minutes ago",
		timestamp: new Date(Date.now() - 8 * 60000),
		duration: "32s",
		responded: false,
		status: "success",
		attempts: 1,
		message: "Collaboration opportunity inquiry",
	},
	{
		id: "MSG-004",
		domain: "healthcareplus.org",
		contactEmail: "contact@healthcareplus.org",
		time: "12 minutes ago",
		timestamp: new Date(Date.now() - 12 * 60000),
		duration: "2m 15s",
		responded: false,
		status: "processing",
		attempts: 1,
		message: "Healthcare services information request",
	},
	{
		id: "MSG-005",
		domain: "edutech.edu",
		contactEmail: "admissions@edutech.edu",
		time: "15 minutes ago",
		timestamp: new Date(Date.now() - 15 * 60000),
		duration: "58s",
		responded: true,
		status: "success",
		responseTime: "2m",
		attempts: 1,
		message: "Online programs inquiry",
	},
	{
		id: "MSG-006",
		domain: "ecommercestore.shop",
		contactEmail: "support@ecommercestore.shop",
		time: "18 minutes ago",
		timestamp: new Date(Date.now() - 18 * 60000),
		duration: "1m 45s",
		responded: false,
		status: "failed",
		attempts: 3,
		message: "Failed: Form validation error - order number required",
	},
	{
		id: "MSG-007",
		domain: "realtors.pro",
		contactEmail: "info@realtors.pro",
		time: "22 minutes ago",
		timestamp: new Date(Date.now() - 22 * 60000),
		duration: "28s",
		responded: false,
		status: "pending",
		attempts: 0,
		message: "Queued for processing",
	},
	{
		id: "MSG-008",
		domain: "fintechsecure.com",
		contactEmail: "contact@fintechsecure.com",
		time: "25 minutes ago",
		timestamp: new Date(Date.now() - 25 * 60000),
		duration: "3m 12s",
		responded: false,
		status: "failed",
		attempts: 2,
		message: "Failed: CAPTCHA + 2FA protection detected",
	},
	{
		id: "MSG-009",
		domain: "manufacturing.global",
		contactEmail: "sales@manufacturing.global",
		time: "30 minutes ago",
		timestamp: new Date(Date.now() - 30 * 60000),
		duration: "1m 08s",
		responded: false,
		status: "success",
		attempts: 1,
		message: "Wholesale pricing inquiry",
	},
	{
		id: "MSG-010",
		domain: "traveladventures.tours",
		contactEmail: "bookings@traveladventures.tours",
		time: "35 minutes ago",
		timestamp: new Date(Date.now() - 35 * 60000),
		duration: "55s",
		responded: false,
		status: "failed",
		attempts: 1,
		message: "Failed: Phone number validation error",
	},
];
