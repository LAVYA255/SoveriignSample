import { motion } from "framer-motion";
import {
  Users,
  Building2,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Activity,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminPage() {
  const { data: stats } = trpc.admin.getDashboardStats.useQuery();
  const { data: users } = trpc.admin.listUsers.useQuery({ limit: 10 });
  const { data: txStats } = trpc.transaction.getStats.useQuery();
  const { data: assets } = trpc.asset.list.useQuery();

  const categoryData = [
    { name: "Real Estate", count: assets?.filter((a: { categoryId: number; }) => a.categoryId === 1).length || 0 },
    { name: "Invoice", count: assets?.filter((a: { categoryId: number; }) => a.categoryId === 2).length || 0 },
    { name: "SCF", count: assets?.filter((a: { categoryId: number; }) => a.categoryId === 3).length || 0 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
          <ShieldCheck size={20} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-sm text-neutral-500">Platform overview and controls</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Assets", value: stats?.totalAssets || 0, icon: Building2, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Active Assets", value: stats?.activeAssetCount || 0, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Investments", value: stats?.totalInvestments || 0, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total AUM", value: `Rs.${(stats?.totalAum || 0).toLocaleString("en-IN")}`, sub: "All user balances" },
          { label: "Total Invested", value: `Rs.${(stats?.totalInvested || 0).toLocaleString("en-IN")}`, sub: "Across all users" },
          { label: "Total Returns", value: `Rs.${(stats?.totalReturns || 0).toLocaleString("en-IN")}`, sub: "Paid out" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <p className="text-xs text-neutral-500 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-neutral-600 mt-0.5">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-orange-400" />
            Asset Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#D4652A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Transaction Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Receipt size={16} className="text-emerald-400" />
            Transaction Summary
          </h3>
          {txStats ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-sm text-neutral-400">Total Transactions</span>
                <span className="text-sm font-medium text-white">{txStats.totalTransactions}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-sm text-neutral-400">Total Volume</span>
                <span className="text-sm font-medium text-white">Rs.{txStats.totalVolume.toLocaleString("en-IN")}</span>
              </div>
              {txStats.byType.map((item: any) => (
                <div key={item.type} className="flex items-center justify-between py-2">
                  <span className="text-sm text-neutral-400 capitalize">{item.type}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{item.count} txns</span>
                    <span className="text-xs text-neutral-500 ml-2">Rs.{item.volume.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No transaction data</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-neutral-500 px-4 py-3">Role</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Balance</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-600/15 flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-400">{u.name?.charAt(0) || "U"}</span>
                      </div>
                      <span className="text-sm text-white">{u.name || "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-400">{u.email || "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${u.role === "admin" ? "bg-orange-500/15 text-orange-400" : "bg-white/5 text-neutral-400"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-white">
                    Rs.{Number(u.wallet?.balance || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-neutral-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Asset Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-400" />
          Asset Lifecycle Control
        </h3>
        <div className="space-y-2">
          {assets?.slice(0, 6).map((asset: any) => (
            <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
              <div>
                <p className="text-sm text-white">{asset.name}</p>
                <p className="text-xs text-neutral-500">{asset.category?.name} · {asset.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${asset.status === "active" ? "bg-emerald-500/10 text-emerald-400" : asset.status === "paused" ? "bg-yellow-500/10 text-yellow-400" : "bg-neutral-500/10 text-neutral-400"}`}>
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
