"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Wallet, ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const allocationData = [
  { name: 'Real Estate', value: 65, color: '#3A7BFF' },
  { name: 'Gold', value: 35, color: '#D4AF37' },
];

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
             <LayoutDashboard size={20} className="text-celestial-orange" /> Dashboard
          </h1>
          <div className="flex gap-4">
             <Link href="/portfolio" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Portfolio</Link>
             <Link href="/wallet" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Wallet</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
           {/* Net Worth */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 col-span-1 md:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-orange/5 rounded-full blur-[80px]" />
              <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Total Net Worth</h2>
              <div className="flex items-end gap-4">
                 <p className="text-5xl md:text-6xl font-bold font-mono tracking-tight text-white">₹24,50,000</p>
                 <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 mb-2">
                    <TrendingUp size={16} /> <span className="text-sm font-bold">+12.4%</span>
                 </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">All-time return: ₹3,03,800</p>
           </motion.div>

           {/* Best Asset */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex flex-col justify-between">
              <div>
                 <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-4">Top Performer</h2>
                 <p className="text-xl font-bold text-white mb-1">Dubai Marina Tower</p>
                 <p className="text-sm text-emerald-400">+14.2% This Month</p>
              </div>
              <Link href="/real-estate/dubai-marina-tower" className="mt-4 flex items-center text-sm text-celestial-orange hover:text-white transition-colors group w-max">
                 View Asset <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
               </Link>
           </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Allocation Chart */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 flex flex-col">
              <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-6">Asset Allocation</h2>
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-full h-48 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={allocationData}
                         cx="50%"
                         cy="50%"
                         innerRadius={60}
                         outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                         stroke="transparent"
                       >
                         {allocationData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{ backgroundColor: '#181818', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold">2</span>
                      <span className="text-xs text-gray-500">Assets</span>
                   </div>
                 </div>
                 <div className="w-full space-y-3 mt-4">
                    {allocationData.map(d => (
                       <div key={d.name} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                             <span className="text-gray-300">{d.name}</span>
                          </div>
                          <span className="font-mono text-gray-400">{d.value}%</span>
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>

           {/* Quick Actions & Activity */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-6">
              
              <div className="grid grid-cols-3 gap-4">
                 <Link href="/assets" className="glass-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-celestial-orange/50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-celestial-orange/20 transition-colors">
                       <TrendingUp size={18} className="text-celestial-orange" />
                    </div>
                    <span className="text-xs font-medium">Browse Assets</span>
                 </Link>
                 <Link href="/market" className="glass-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-celestial-orange/50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-celestial-orange/20 transition-colors">
                       <ArrowUpRight size={18} className="text-celestial-orange" />
                    </div>
                    <span className="text-xs font-medium">Trade Market</span>
                 </Link>
                 <Link href="/wallet" className="glass-panel p-4 flex flex-col items-center justify-center gap-2 hover:border-celestial-orange/50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-celestial-orange/20 transition-colors">
                       <Wallet size={18} className="text-celestial-orange" />
                    </div>
                    <span className="text-xs font-medium">Manage Wallet</span>
                 </Link>
              </div>

              <div className="glass-panel p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Recent Activity</h2>
                    <Link href="/wallet" className="text-xs text-celestial-orange hover:underline">View All</Link>
                 </div>
                 <div className="space-y-4">
                    {[
                      { type: 'Investment', asset: 'Dubai Marina Tower', amount: '₹12,00,000', time: '2 Days Ago', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                      { type: 'Trade (Buy)', asset: 'Gold Reserve Alpha', amount: '₹58,000', time: '1 Week Ago', icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                      { type: 'Deposit', asset: 'Bank Transfer', amount: '₹15,00,000', time: '1 Month Ago', icon: Wallet, color: 'text-white', bg: 'bg-white/10' },
                    ].map((act, i) => (
                       <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${act.bg}`}>
                                <act.icon size={16} className={act.color} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-200">{act.type}</p>
                                <p className="text-xs text-gray-500">{act.asset}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-mono text-sm font-bold">{act.amount}</p>
                             <p className="text-xs text-gray-500">{act.time}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
