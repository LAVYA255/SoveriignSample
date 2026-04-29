import { motion } from "framer-motion";
import { Receipt, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState } from "react";

const txTypeIcons: Record<string, { icon: typeof ArrowUpRight; color: string; bg: string }> = {
  investment: { icon: ArrowUpRight, color: "text-orange-400", bg: "bg-orange-500/10" },
  return: { icon: ArrowDownRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  deposit: { icon: ArrowDownRight, color: "text-blue-400", bg: "bg-blue-500/10" },
  exit: { icon: ArrowUpRight, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  claim: { icon: ArrowDownRight, color: "text-purple-400", bg: "bg-purple-500/10" },
  withdrawal: { icon: ArrowUpRight, color: "text-red-400", bg: "bg-red-500/10" },
  fee: { icon: ArrowUpRight, color: "text-neutral-400", bg: "bg-white/5" },
};

const statusColors: Record<string, string> = {
  completed: "text-emerald-400 bg-emerald-500/10",
  pending: "text-yellow-400 bg-yellow-500/10",
  failed: "text-red-400 bg-red-500/10",
  cancelled: "text-neutral-400 bg-white/5",
};

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { data: transactions, isLoading } = trpc.transaction.list.useQuery({
    type: typeFilter as any,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Transactions</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Complete transaction history</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-neutral-500" />
          <span className="text-xs text-neutral-500">Type:</span>
        </div>
        {["all", "investment", "return", "deposit", "exit", "claim"].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t === "all" ? undefined : t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${typeFilter === t || (t === "all" && !typeFilter) ? "bg-orange-600 text-white" : "bg-white/[0.05] text-neutral-400 hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-medium text-neutral-500 px-5 py-3">Type</th>
                <th className="text-left text-xs font-medium text-neutral-500 px-5 py-3">Description</th>
                <th className="text-left text-xs font-medium text-neutral-500 px-5 py-3">Asset</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-5 py-3">Amount</th>
                <th className="text-center text-xs font-medium text-neutral-500 px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-neutral-500 px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-4">
                      <div className="h-10 animate-shimmer rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : transactions && transactions.length > 0 ? (
                transactions.map((tx: any, i: number) => {
                  const config = txTypeIcons[tx.type] || txTypeIcons.fee;
                  const Icon = config.icon;
                  return (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                            <Icon size={14} className={config.color} />
                          </div>
                          <span className="text-sm text-white capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-400">{tx.description || "-"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-400">{tx.asset?.name || "-"}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`text-sm font-medium ${tx.type === "investment" || tx.type === "exit" || tx.type === "withdrawal" || tx.type === "fee" ? "text-red-400" : "text-emerald-400"}`}>
                          {tx.type === "investment" || tx.type === "exit" || tx.type === "withdrawal" || tx.type === "fee" ? "-" : "+"}
                          Rs.{Number(tx.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tx.status] || "text-neutral-400 bg-white/5"}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-xs text-neutral-500">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-IN") : "-"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Receipt size={40} className="text-neutral-700 mx-auto mb-3" />
                    <p className="text-neutral-400">No transactions yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
