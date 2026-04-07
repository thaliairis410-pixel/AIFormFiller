import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import History from "./pages/History";
import Index from "./pages/Index";
import Process from "./pages/Process";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/process" element={<Process />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
