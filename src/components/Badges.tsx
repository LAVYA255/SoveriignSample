import { Building2, FileText, Truck } from "lucide-react";
export type AssetClass = "real-estate" | "invoice" | "scf";

const map = {
  "real-estate": { icon: Building2, label: "Real Estate", color: "text-orange-300", bg: "bg-orange-500/10 border-orange-500/20" },
  invoice: { icon: FileText, label: "Invoice", color: "text-sky-300", bg: "bg-sky-500/10 border-sky-500/20" },
  scf: { icon: Truck, label: "SCF", color: "text-violet-300", bg: "bg-violet-500/10 border-violet-500/20" },
};

export const AssetTypeBadge = ({ type, size = "sm" }: { type: AssetClass; size?: "sm" | "md" }) => {
  const { icon: Icon, label, color, bg } = map[type];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${bg} ${color} ${size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"} font-medium`}>
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} /> {label}
    </span>
  );
};

export const RiskBadge = ({ risk }: { risk: string }) => {
  const normalized = risk.toLowerCase();
  const styles = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    moderate: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  }[normalized] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return <span className={`inline-flex items-center gap-1 rounded-md border ${styles} text-[11px] px-2 py-0.5 font-medium`}>{label} Risk</span>;
};
