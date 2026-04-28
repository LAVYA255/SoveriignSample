import { inr } from "../lib/format";
import { AssetTypeBadge, RiskBadge } from "./Badges";
import { Sparkline } from "./Sparkline";
import { Link } from "react-router";
import { MapPin, Calendar } from "lucide-react";

export const AssetCard = ({ asset, idx = 0 }: { asset: any; idx?: number }) => {
  const totalValue = Number(asset.totalValue) || 0;
  const fundedAmount = Number(asset.fundedAmount) || 0;
  const fundedPct = totalValue > 0 ? Math.min(100, (fundedAmount / totalValue) * 100) : 0;
  const roi = Number(asset.expectedRoi) || 0;

  const categorySlug: string = asset.category?.slug ?? "";
  const badgeType = categorySlug.includes("real")
    ? "real-estate"
    : categorySlug.includes("invoice")
      ? "invoice"
      : "scf";

  return (
    <div className="group glass-card rounded-2xl p-5 hover:border-orange-600/30 transition-all relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <AssetTypeBadge type={badgeType} />
            <RiskBadge risk={asset.riskLevel ?? "low"} />
          </div>
          <Link to={`/asset/${asset.slug}`} className="block mt-2.5">
            <h3 className="text-[15px] font-semibold leading-snug truncate group-hover:text-orange-500 transition-colors">{asset.name}</h3>
          </Link>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-500">
            {asset.location && <span className="flex items-center gap-1"><MapPin className="size-3" />{asset.location}</span>}
            <span className="flex items-center gap-1"><Calendar className="size-3" />{asset.duration}{asset.durationUnit === 'months' ? 'm' : 'd'}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] text-neutral-500">ROI p.a.</div>
          <div className="text-xl text-orange-500 font-semibold">{roi}%</div>
        </div>
      </div>


      <div className="mt-4 -mx-1">
        <Sparkline
          data={[
            { x: 0, y: 10 }, { x: 1, y: 15 }, { x: 2, y: 12 }, { x: 3, y: 18 },
            { x: 4, y: 16 }, { x: 5, y: 22 }, { x: 6, y: 20 }
          ]}
          positive
          height={42}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
        <div>
          <div className="text-neutral-500">Valuation</div>
          <div className="font-medium mt-0.5">{inr(Number(asset.totalValue || 0), { compact: true })}</div>
        </div>
        <div>
          <div className="text-neutral-500">Min. Invest</div>
          <div className="font-medium mt-0.5">{inr(Number(asset.minInvestment || 0), { compact: true })}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-neutral-500 mb-1.5">
          <span>Funded</span><span className="font-medium text-neutral-300">{fundedPct.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700" style={{ width: `${fundedPct}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Link
          to={`/asset/${asset.slug}`}
          className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20"
        >
          Invest
        </Link>
        <Link
          to={`/asset/${asset.slug}`}
          className="px-3 py-2 border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] rounded-lg text-xs font-medium transition-all"
        >
          Details
        </Link>
      </div>
    </div>
  );
};
