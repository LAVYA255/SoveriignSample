import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber = ({ value, duration = 1100, decimals = 0, format, className, prefix = "", suffix = "" }: Props) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    const to = isNaN(value) ? 0 : value;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = from + (to - from) * eased;
      setDisplay(cur);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const text = format
    ? format(display)
    : `${prefix}${(display || 0).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  return <span className={className}>{text}</span>;
};
