"use client";

import { motion } from "framer-motion";
import { PieChart as PieChartIcon, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PriceChart from "@/components/charts/PriceChart";

const portfolioAssets = [
  { id: 'dubai-marina-tower', name: 'Dubai Marina Tower', type: 'Real Estate', tokens: 100, entryPrice: 11500, currentPrice: 12000, value: 1200000, pnl: 50000, pnlPct: 4.35, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop' },
  { id: 'gold-res-alpha', name: 'Gold Reserve Alpha', type: 'Commodity', tokens: 215.5, entryPrice: 5600, currentPrice: 5800, value: 1249900, pnl: 43100, pnlPct: 3.57, image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop' },
];

export default function PortfolioPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalInvested = portfolioAssets.reduce((acc, a) => acc + (a.entryPrice * a.tokens), 0);
  const currentValue = portfolioAssets.reduce((acc, a) => acc + a.value, 0);
  const totalPnl = currentValue - totalInvested;
  const totalPnlPct = (totalPnl / totalInvested) * 100;

  return (
    <div className="w-full">
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
             <PieChartIcon size={20} className="text-celestial-orange" /> Portfolio
          </h1>
          <div className="flex gap-4">
             <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Dashboard</Link>
             <Link href="/wallet" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Wallet</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
         
         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6 border-l-4 border-l-gray-600">
               <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Total Invested</h2>
               <p className="text-3xl font-bold font-mono">₹{totalInvested.toLocaleString()}</p>
            </div>
            <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
               <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Total Returns</h2>
               <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold font-mono text-emerald-400">+₹{totalPnl.toLocaleString()}</p>
                  <p className="text-sm font-bold text-emerald-400 mb-1">(+{totalPnlPct.toFixed(2)}%)</p>
               </div>
            </div>
         </div>

         {/* Asset List */}
         <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4">Your Assets</h2>
            
            {portfolioAssets.map(asset => {
               const isExpanded = expandedId === asset.id;
               return (
                 <div key={asset.id} className="glass-panel overflow-hidden transition-all duration-300">
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : asset.id)}
                      className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-white/[0.02] transition-colors"
                    >
                       <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <img src={asset.image} alt={asset.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                          <div>
                             <h3 className="font-bold text-lg">{asset.name}</h3>
                             <p className="text-xs text-gray-500">{asset.tokens} Tokens • {asset.type}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
                          <div className="text-left md:text-right">
                             <p className="font-mono font-bold text-lg text-white">₹{asset.value.toLocaleString()}</p>
                             <p className="text-xs text-gray-500">Current Value</p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                             <div>
                                <p className={`font-mono font-bold text-sm flex items-center justify-end gap-1 ${asset.pnl >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                   {asset.pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                   ₹{Math.abs(asset.pnl).toLocaleString()}
                                </p>
                                <p className={`text-xs ${asset.pnl >= 0 ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                                   {asset.pnl >= 0 ? '+' : '-'}{asset.pnlPct.toFixed(2)}%
                                </p>
                             </div>
                             <button className="w-8 h-8 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-gray-400">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                             </button>
                          </div>
                       </div>
                    </div>

                    {isExpanded && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 bg-black/20">
                          <div className="p-6">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                <div>
                                   <p className="text-xs text-gray-500 mb-1">Entry Price</p>
                                   <p className="font-mono font-semibold">₹{asset.entryPrice.toLocaleString()}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-gray-500 mb-1">Current Price</p>
                                   <p className="font-mono font-semibold text-emerald-400">₹{asset.currentPrice.toLocaleString()}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-gray-500 mb-1">Tokens Owned</p>
                                   <p className="font-mono font-semibold">{asset.tokens}</p>
                                </div>
                                <div>
                                   <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                                   <p className="font-mono font-semibold">₹{(asset.entryPrice * asset.tokens).toLocaleString()}</p>
                                </div>
                             </div>
                             
                             <div className="pt-4 border-t border-white/5">
                                <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Performance Over Time</h4>
                                <PriceChart />
                             </div>
                             
                             <div className="mt-6 flex justify-end gap-4">
                               <Link href={asset.type === 'Commodity' ? '/gold' : `/real-estate/${asset.id}`} className="px-6 py-2 rounded-lg bg-[#181818] hover:bg-[#222] border border-white/10 transition-colors text-sm font-medium">
                                 Asset Details
                               </Link>
                               <Link href="/market" className="px-6 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold">
                                 Trade Asset
                               </Link>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
