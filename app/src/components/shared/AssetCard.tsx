import { motion } from "framer-motion";
import { TrendingUp, MapPin, Clock, Lock, ArrowRightLeft, Unlock } from "lucide-react";
import { Link } from "react-router";
import { RiskBadge } from "../Badges";
import type { Asset } from "@db/schema";

interface AssetCardProps {
  asset: Asset & { category?: { name: string; slug: string } | null };
  delay?: number;
}

export default function AssetCard({ asset, delay = 0 }: AssetCardProps) {
  const roi = Number(asset.expectedRoi);
  const progress = Math.min(Number(asset.fundingProgress), 100);
  const funded = Number(asset.fundedAmount);
  const total = Number(asset.totalValue);




  const liquidityIcons = {
    locked: Lock,
    tradable: ArrowRightLeft,
    flexible: Unlock,
  } as const;
  const LiquidityIcon = liquidityIcons[asset.liquidityType as keyof typeof liquidityIcons] || Lock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={`/asset/${asset.slug}`}>
        <motion.div
          whileHover={{ scale: 1.01, y: -3 }}
          whileTap={{ scale: 0.99 }}
          className="glass-card rounded-xl overflow-hidden card-hover group cursor-pointer h-full flex flex-col"
        >
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={asset.image || "/assets/re-1.jpg"}
              alt={asset.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <RiskBadge risk={asset.riskLevel} />
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/10 flex items-center gap-1">
                <LiquidityIcon size={12} />
                {asset.liquidityType.charAt(0).toUpperCase() + asset.liquidityType.slice(1)}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-sm font-semibold text-white line-clamp-1">{asset.name}</h3>
              {asset.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-neutral-400" />
                  <span className="text-xs text-neutral-400">{asset.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-neutral-500">Expected ROI</p>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-orange-400" />
                  <span className="text-lg font-bold text-orange-400">{roi}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-500">Min Investment</p>
                <span className="text-sm font-semibold text-white">
                  Rs.{Number(asset.minInvestment).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-neutral-500">Funding</span>
                <span className="text-xs text-orange-400 font-medium">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Rs.{funded.toLocaleString("en-IN")} of Rs.{total.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 mt-auto">
              <Clock size={12} className="text-neutral-500" />
              <span className="text-xs text-neutral-500">
                {asset.duration} {asset.durationUnit}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
