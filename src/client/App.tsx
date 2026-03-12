import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Process from "./pages/Process";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Index />} />
					<Route path="/process" element={<Process />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
