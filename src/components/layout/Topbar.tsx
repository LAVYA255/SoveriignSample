import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/real-estate": "Real Estate",
  "/invoice-financing": "Invoice Financing",
  "/supply-chain": "Supply Chain Finance",
  "/live-market": "Live Market",
  "/portfolio": "Portfolio",
  "/transactions": "Transactions",
  "/profile": "Profile",
  "/admin": "Admin Dashboard",
};

export default function Topbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "AstraRWA";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
      <motion.h1
        key={title}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-white"
      >
        {title}
      </motion.h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search assets..."
            className="pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all w-64"
          />
        </div>
        <button className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  );
}
