import { Zap } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="sticky top-0 w-full left-0 bg-white flex h-18 border-b border-b-zinc-300 p-6 z-50">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <h1 className="text-lg font-bold text-blue-600 inline-flex gap-2 items-center">
            <Zap /> AI Form Filler
          </h1>
        </Link>

        <nav className="flex gap-6 text-sm *:hover:underline">
          <Link to="/process">Process</Link>
          <Link to="/history">History</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
