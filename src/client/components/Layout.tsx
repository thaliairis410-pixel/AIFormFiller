import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 bg-zinc-50/70">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
