import { motion } from "framer-motion";
import { Wallet, TrendingUp, PieChart as PieIcon, ArrowUpRight, Package } from "lucide-react";
import { trpc } from "@/providers/trpc";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

const COLORS = ["#D4652A", "#2A9D8F", "#E9C46A"];

const growthData = [
  { month: "Jan", value: 250000 },
  { month: "Feb", value: 285000 },
  { month: "Mar", value: 320000 },
  { month: "Apr", value: 365000 },
  { month: "May", value: 410000 },
  { month: "Jun", value: 475000 },
];

export default function PortfolioPage() {
  const { data: summary, isLoading } = trpc.investment.getPortfolioSummary.useQuery();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "exited">("all");

  const exitMutation = trpc.investment.exit.useMutation({
    onSuccess: () => window.location.reload(),
  });

  const filteredInvestments = summary?.investments.filter((inv) => {
    if (activeTab === "active") return inv.status === "active";
    if (activeTab === "exited") return inv.status === "exited";
    return true;
  });

  const allocationData = summary?.byCategory.map((cat, i) => ({
    name: cat.name,
    value: cat.value,
    color: COLORS[i % COLORS.length],
  })) || [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: `Rs.${Math.round(summary?.totalInvested || 0).toLocaleString("en-IN")}`, icon: Wallet, color: "text-orange-400" },
          { label: "Total Returns", value: `Rs.${Math.round(summary?.totalReturns || 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-emerald-400" },
          { label: "Active Investments", value: String(summary?.activeCount || 0), icon: Package, color: "text-blue-400" },
          { label: "Unrealized Gains", value: `Rs.${Math.round(summary?.unrealizedReturns || 0).toLocaleString("en-IN")}`, icon: PieIcon, color: "text-yellow-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
              <span className="text-xs text-neutral-500">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Portfolio Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4652A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4652A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              <Area type="monotone" dataKey="value" stroke="#D4652A" fill="url(#growthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px" }} formatter={(v: number) => `Rs.${v.toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-neutral-400">{item.name}</span>
                </div>
                <span className="text-xs text-white font-medium">Rs.{item.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Holdings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Your Holdings</h3>
          <div className="flex items-center gap-1">
            {(["all", "active", "exited"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${activeTab === tab ? "bg-orange-600 text-white" : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            [1, 2, 3].map((i) => <div key={i} className="h-16 animate-shimmer rounded-lg" />)
          ) : filteredInvestments && filteredInvestments.length > 0 ? (
            filteredInvestments.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{inv.asset?.name || "Unknown"}</p>
                  <p className="text-xs text-neutral-500">
                    {inv.asset?.category?.name || ""} · {inv.status}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-white">Rs.{Number(inv.amount).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-emerald-400">
                    <ArrowUpRight size={10} className="inline" />
                    {Number(Number(inv.expectedReturn) - Number(inv.amount)).toLocaleString("en-IN")} expected
                  </p>
                </div>
                {inv.status === "active" && inv.asset?.liquidityType !== "locked" && (
                  <button
                    onClick={() => exitMutation.mutate({ investmentId: inv.id, exitPrice: inv.amount })}
                    disabled={exitMutation.isPending}
                    className="px-4 py-2 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                  >
                    Exit
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package size={40} className="text-neutral-700 mx-auto mb-3" />
              <p className="text-neutral-400">No investments yet</p>
              <p className="text-sm text-neutral-600 mt-1">Start investing to build your portfolio</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
