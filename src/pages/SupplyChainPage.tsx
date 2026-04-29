import { motion } from "framer-motion";
import { Truck, Unlock, Droplets } from "lucide-react";
import { trpc } from "@/providers/trpc";
import AssetCard from "@/components/shared/AssetCard";

export default function SupplyChainPage() {
  const { data: assets, isLoading } = trpc.asset.list.useQuery({ categorySlug: "supply-chain-finance" });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden h-48"
      >
        <img src="/assets/scf-1.jpg" alt="Supply Chain" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Truck size={20} className="text-blue-400" />
            </div>
            <span className="text-sm text-blue-400 font-medium">Liquidity Driven</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Supply Chain Finance</h1>
          <p className="text-neutral-400 text-sm max-w-lg">
            Pool-based supply chain funding with flexible entry and exit. Daily yield accrual.
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Unlock size={12} />
              <span>Flexible liquidity</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Droplets size={12} />
              <span>Daily accrual</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pools", value: assets?.length || 0 },
          { label: "Active", value: (assets as any[])?.filter((a: any) => a.status === "active").length || 0 },
          { label: "Avg ROI", value: assets?.length ? ((assets as any[]).reduce((s: number, a: any) => s + Number(a.expectedRoi), 0) / assets.length).toFixed(1) + "%" : "0%" },
          { label: "Total Pool Size", value: "Rs." + ((assets as any[])?.reduce((s: number, a: any) => s + Number(a.totalValue), 0).toLocaleString("en-IN") || "0") },
        ].map((stat: any, i: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card rounded-xl p-4 text-center"
          >
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl h-80 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets?.map((asset: any, i: number) => (
            <AssetCard key={asset.id} asset={asset} delay={i * 0.1} />
          ))}
        </div>
      )}
    </div>
  );
}
