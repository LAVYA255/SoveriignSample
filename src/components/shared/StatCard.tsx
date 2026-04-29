import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedNumber } from "../AnimatedNumber";

interface StatCardProps {
  title: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  delay?: number;
  glowColor?: "orange" | "green" | "blue" | "none";
}

export default function StatCard({
  title,
  value,
  prefix = "Rs. ",
  suffix = "",
  change,
  changeLabel = "vs last month",
  icon,
  delay = 0,
  glowColor = "none",
}: StatCardProps) {
  const glowClasses = {
    orange: "hover:shadow-lg hover:shadow-orange-600/10 border-orange-600/10",
    green: "hover:shadow-lg hover:shadow-emerald-600/10 border-emerald-600/10",
    blue: "hover:shadow-lg hover:shadow-blue-600/10 border-blue-600/10",
    none: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={`glass-card rounded-xl p-5 card-hover ${glowClasses[glowColor]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">
            <AnimatedNumber value={parseFloat(value.replace(/,/g, ""))} prefix={prefix} suffix={suffix} decimals={value.includes(".") ? 2 : 0} />
          </h3>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {change >= 0 ? (
                <TrendingUp size={14} className="text-emerald-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
              <span
                className={`text-xs font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-neutral-600">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-orange-500">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
