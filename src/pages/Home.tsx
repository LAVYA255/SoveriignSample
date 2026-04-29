import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  FileText,
  Truck,
  Activity,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import StatCard from "@/components/shared/StatCard";
import { AssetCard } from "@/components/AssetCard";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#D4652A", "#2A9D8F", "#E9C46A", "#264653", "#E76F51"];

const performanceData = [
  { month: "Jan", value: 280000, returns: 12000 },
  { month: "Feb", value: 295000, returns: 15000 },
  { month: "Mar", value: 310000, returns: 18000 },
  { month: "Apr", value: 335000, returns: 22000 },
  { month: "May", value: 358000, returns: 28000 },
  { month: "Jun", value: 392000, returns: 34000 },
];

const allocationData = [
  { name: "Real Estate", value: 45, color: COLORS[0] },
  { name: "Invoice Financing", value: 30, color: COLORS[1] },
  { name: "Supply Chain", value: 25, color: COLORS[2] },
];

export default function Home() {
  const { supabaseId, isLoading: authLoading } = useAuth();
  const { data: wallet, isLoading: walletLoading } = trpc.wallet.get.useQuery(
    { supabaseId: supabaseId! }, 
    { enabled: !!supabaseId }
  );
  const { data: portfolioSummary } = trpc.investment.getPortfolioSummary.useQuery();
  const { data: recentTx } = trpc.transaction.list.useQuery({ limit: 5 });
  const { data: assets } = trpc.asset.list.useQuery({ status: "active" });

  const utils = trpc.useUtils();
  const claimMutation = trpc.wallet.claimBalance.useMutation();

  const handleClaim = async () => {
    if (!supabaseId) return;
    try {
      await claimMutation.mutateAsync({ supabaseId });
      utils.wallet.get.invalidate();
    } catch (error) {
      console.error("Failed to claim balance", error);
    }
  };

  if (authLoading || (!!supabaseId && walletLoading)) {
    return (
      <div className="flex items-center justify-center py-20 bg-[#0A0A0A]">
        <div className="text-orange-500">Loading Dashboard...</div>
      </div>
    );
  }

  const balance = Number(wallet?.balance || 0);
  const totalInvested = Number(portfolioSummary?.totalInvested || 0);
  const totalReturns = Number(portfolioSummary?.totalReturns || 0);
  const portfolioValue = balance + totalInvested + totalReturns;

  const txTypeIcons: Record<string, React.ReactNode> = {
    investment: <ArrowUpRight size={14} className="text-orange-400" />,
    return: <ArrowDownRight size={14} className="text-emerald-400" />,
    deposit: <ArrowDownRight size={14} className="text-blue-400" />,
    exit: <ArrowUpRight size={14} className="text-yellow-400" />,
    claim: <ArrowDownRight size={14} className="text-purple-400" />,
  };

  const txTypeColors: Record<string, string> = {
    investment: "text-orange-400",
    return: "text-emerald-400",
    deposit: "text-blue-400",
    exit: "text-yellow-400",
    claim: "text-purple-400",
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Portfolio Value"
          value={Math.round(portfolioValue).toString()}
          prefix="Rs. "
          change={8.4}
          icon={<IndianRupee size={20} />}
          delay={0}
          glowColor="orange"
        />
        <StatCard
          title="Available Balance"
          value={Math.round(balance).toString()}
          prefix="Rs. "
          icon={<Wallet size={20} />}
          delay={0.1}
        />
        <StatCard
          title="Total Invested"
          value={Math.round(totalInvested).toString()}
          prefix="Rs. "
          icon={<PiggyBank size={20} />}
          delay={0.2}
        />
        <StatCard
          title="Total Returns"
          value={Math.round(totalReturns).toString()}
          prefix="Rs. "
          change={12.3}
          icon={<TrendingUp size={20} />}
          delay={0.3}
          glowColor="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Portfolio Performance</h3>
              <p className="text-xs text-neutral-500">Last 6 months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-xs text-neutral-400">Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-neutral-400">Returns</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4652A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4652A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs.${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`Rs.${value.toLocaleString("en-IN")}`, ""]}
              />
              <Area type="monotone" dataKey="value" stroke="#D4652A" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} name="Portfolio Value" />
              <Area type="monotone" dataKey="returns" stroke="#2A9D8F" fillOpacity={1} fill="url(#colorReturns)" strokeWidth={2} name="Returns" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Allocation Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Asset Allocation</h3>
          <p className="text-xs text-neutral-500 mb-4">By category</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-neutral-400">{item.name}</span>
                </div>
                <span className="text-xs text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Claim Balance", icon: Wallet, desc: "Add funds to wallet", color: "bg-blue-500/15 text-blue-400" },
              { label: "Invest Now", icon: TrendingUp, desc: "Browse active assets", color: "bg-orange-500/15 text-orange-400" },
              { label: "View Portfolio", icon: Activity, desc: "Track your investments", color: "bg-emerald-500/15 text-emerald-400" },
            ].map((action) => (
              <motion.button
                key={action.label}
                onClick={action.label === "Claim Balance" ? handleClaim : undefined}
                disabled={action.label === "Claim Balance" && claimMutation.isPending}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left group disabled:opacity-50"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <action.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-neutral-500">{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Asset Categories</h3>
          <div className="space-y-3">
            {[
              { name: "Real Estate", count: 3, roi: "12.9%", icon: Building2, color: "text-orange-400", bg: "bg-orange-500/10" },
              { name: "Invoice Financing", count: 3, roi: "10.4%", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { name: "Supply Chain", count: 3, roi: "10.5%", icon: Truck, color: "text-blue-400", bg: "bg-blue-500/10" },
            ].map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center`}>
                    <cat.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-neutral-500">{cat.count} assets</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400">{cat.roi}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentTx && recentTx.length > 0 ? (
              recentTx.map((tx: any, i: number) => (
                <div key={tx.id || i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center`}>
                    {txTypeIcons[tx.type] || <Activity size={14} className="text-neutral-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white capitalize truncate">{tx.type}</p>
                    <p className="text-xs text-neutral-500">{tx.description || "-"}</p>
                  </div>
                  <span className={`text-sm font-medium ${txTypeColors[tx.type] || "text-white"}`}>
                    {tx.type === "investment" || tx.type === "exit" ? "-" : "+"}Rs.{Number(tx.amount).toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500">No recent activity</p>
                <p className="text-xs text-neutral-600 mt-1">Start investing to see activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Featured Opportunities Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            Featured Opportunities
          </h2>
          <Link to="/live-market" className="text-xs text-orange-500 hover:underline">
            View all market listings →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets?.slice(0, 3)?.map((asset: any, i: number) => (
            <AssetCard key={asset.id} asset={asset} idx={i} />
          ))}
          {!assets && (
            [1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl h-64 animate-shimmer" />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
