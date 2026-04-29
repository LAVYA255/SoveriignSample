import { useLocation, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Truck,
  TrendingUp,
  Wallet,
  Receipt,
  UserCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/real-estate", label: "Real Estate", icon: Building2 },
  { path: "/invoice-financing", label: "Invoice Financing", icon: FileText },
  { path: "/supply-chain", label: "Supply Chain", icon: Truck },
  { path: "/live-market", label: "Live Market", icon: TrendingUp },
  { path: "/portfolio", label: "Portfolio", icon: Wallet },
  { path: "/transactions", label: "Transactions", icon: Receipt },
  { path: "/profile", label: "Profile", icon: UserCircle },
];

const adminItem = { path: "/admin", label: "Admin", icon: ShieldCheck };

export default function Sidebar() {
  const location = useLocation();
  const { user, userData, logout, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = userData?.role === "admin";

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-white/[0.06] z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <img src="/astra-logo.png" alt="Astra" className="w-8 h-8 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-bold text-white whitespace-nowrap"
              >
                Astra<span className="text-orange-500">RWA</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group ${
                  isActive
                    ? "bg-orange-600/15 text-orange-400 border border-orange-600/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-orange-400" : "text-neutral-500 group-hover:text-neutral-300"}`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}

        {isAdmin && (
          <Link to={adminItem.path} className="block mt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 group ${
                location.pathname === "/admin"
                  ? "bg-orange-600/15 text-orange-400 border border-orange-600/20"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <ShieldCheck
                size={20}
                className={`shrink-0 ${location.pathname === "/admin" ? "text-orange-400" : "text-neutral-500 group-hover:text-neutral-300"}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {adminItem.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/[0.06] shrink-0">
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-orange-400">
                {(userData?.username || user.displayName || "U").charAt(0)}
              </span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium text-white truncate">{userData?.username || user.displayName || "User"}</p>
                  <p className="text-xs text-neutral-500 truncate">{user.email || "No email"}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-1"
          >
            <LogOut size={16} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>
    </motion.aside>
  );
}
