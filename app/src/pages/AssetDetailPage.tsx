import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Clock,
  TrendingUp,
  Lock,
  ArrowRightLeft,
  Unlock,
  FileText,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { RiskBadge } from "@/components/Badges";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InvestModal from "@/components/shared/InvestModal";

export default function AssetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showInvest, setShowInvest] = useState(false);

  const { data: asset, isLoading } = trpc.asset.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-xl h-96 animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-xl h-80 animate-shimmer" />
          <div className="glass-card rounded-xl h-80 animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-neutral-400">Asset not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-orange-400 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const roi = Number(asset.expectedRoi);
  const progress = Math.min(Number(asset.fundingProgress), 100);
  const funded = Number(asset.fundedAmount);
  const total = Number(asset.totalValue);
  const minInv = Number(asset.minInvestment);

  const riskConfig = {
    low: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    moderate: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  } as const;
  const risk = riskConfig[asset.riskLevel as keyof typeof riskConfig] || riskConfig.moderate;

  const liquidityIcons = {
    locked: Lock,
    tradable: ArrowRightLeft,
    flexible: Unlock,
  };
  const LiquidityIcon = liquidityIcons[asset.liquidityType as keyof typeof liquidityIcons] || Lock;

  const perfData = asset.performance?.map((p: { date: Date | string; navValue: string | number; yieldAccrued: string | number }) => ({
    date: new Date(p.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    nav: Number(p.navValue),
    yield: Number(p.yieldAccrued),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <img src={asset.image || "/assets/re-1.jpg"} alt={asset.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <RiskBadge risk={asset.riskLevel} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/10 flex items-center gap-1">
                <LiquidityIcon size={12} />
                {asset.liquidityType.charAt(0).toUpperCase() + asset.liquidityType.slice(1)}
              </span>
            </div>
          <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
          {asset.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-400">{asset.location}</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Expected ROI", value: `${roi}%`, icon: TrendingUp, color: "text-orange-400" },
              { label: "Total Value", value: `Rs.${total.toLocaleString("en-IN")}`, icon: DollarSign, color: "text-white" },
              { label: "Duration", value: `${asset.duration} ${asset.durationUnit}`, icon: Clock, color: "text-blue-400" },
              { label: "Min Investment", value: `Rs.${minInv.toLocaleString("en-IN")}`, icon: BarChart3, color: "text-emerald-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} className={stat.color} />
                  <span className="text-xs text-neutral-500">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Overview</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{asset.description || "No description available."}</p>
          </motion.div>

          {/* Performance Chart */}
          {perfData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Performance History</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={perfData}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4652A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4652A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="nav" stroke="#D4652A" fill="url(#colorNav)" strokeWidth={2} name="NAV" />
                  <Area type="monotone" dataKey="yield" stroke="#2A9D8F" fill="none" strokeWidth={2} name="Yield" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Documents</h3>
            <div className="space-y-2">
              {asset.documents && Array.isArray(asset.documents) && asset.documents.length > 0 ? (
                asset.documents.map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
                    <FileText size={16} className="text-orange-400" />
                    <span className="text-sm text-white">{doc}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03]">
                  <FileText size={16} className="text-neutral-600" />
                  <span className="text-sm text-neutral-500">No documents available</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Investment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="glass-card rounded-xl p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-white mb-4">Investment</h3>

            {/* Funding Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500">Funding Progress</span>
                <span className="text-sm font-bold text-orange-400">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
              <p className="text-xs text-neutral-600 mt-1.5">
                Rs.{funded.toLocaleString("en-IN")} raised of Rs.{total.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Key Numbers */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-sm text-neutral-400">Expected ROI</span>
                <span className="text-sm font-bold text-orange-400">{roi}%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-sm text-neutral-400">Min Investment</span>
                <span className="text-sm font-medium text-white">Rs.{minInv.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-sm text-neutral-400">Duration</span>
                <span className="text-sm font-medium text-white">{asset.duration} {asset.durationUnit}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-400">Risk Level</span>
                <span className={`text-sm font-medium capitalize ${risk.color}`}>{asset.riskLevel}</span>
              </div>
            </div>

            <button
              onClick={() => setShowInvest(true)}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-[0.98]"
            >
              Invest Now
            </button>
          </div>
        </motion.div>
      </div>

      {showInvest && <InvestModal asset={asset} onClose={() => setShowInvest(false)} />}
    </div>
  );
}
