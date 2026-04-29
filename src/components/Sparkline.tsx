import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface Props { data: { x: number; y: number }[]; positive?: boolean; height?: number; }

export const Sparkline = ({ data, positive = true, height = 36 }: Props) => {
  const color = positive ? "hsl(152 45% 52%)" : "hsl(4 70% 60%)";
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.6} fill={`url(#${id})`} isAnimationActive />
      </AreaChart>
    </ResponsiveContainer>
  );
};
