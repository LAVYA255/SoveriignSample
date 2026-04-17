"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { mockAssets } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowLeft, MapPin, Building, Info, ShieldCheck, PieChart, TrendingUp } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const pieData = [
  { name: 'Available', value: 45, color: '#FF6A1A' },
  { name: 'Sold', value: 40, color: '#3A7BFF' },
  { name: 'Reserved', value: 15, color: '#181818' },
];

export default function PropertyDetail() {
  const params = useParams();
  const asset = mockAssets.find(a => a.id === params.id);
  
  const [amount, setAmount] = useState('');
  
  if (!asset) return <div className="p-20 text-center">Asset not found</div>;

  const tokens = amount ? parseFloat(amount) / asset.tokenPrice : 0;

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <Link href="/real-estate" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Real Estate
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Top Hero Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           <div className="lg:col-span-2 rounded-3xl overflow-hidden h-[400px] md:h-[500px] relative">
              <img src={asset.image} alt={asset.name} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur rounded border border-white/10 text-xs uppercase tracking-wider text-celestial-orange mb-4">
                    <Building size={14} /> Premium {asset.type.replace('-', ' ')}
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{asset.name}</h1>
                 <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={18} /> {asset.location}
                 </div>
              </div>
           </div>

           {/* Investment Quick Panel */}
           <div className="glass-panel p-6 flex flex-col justify-between">
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Investment Overview</h2>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-gray-400">Total Valuation</span>
                       <span className="text-xl font-bold">₹{((asset.totalSupply * asset.tokenPrice) / 100000).toFixed(1)} Cr</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-gray-400">Token Price</span>
                       <span className="text-xl font-bold font-mono text-white">₹{asset.tokenPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                       <span className="text-gray-400">Expected Yield</span>
                       <span className="text-xl font-bold text-emerald-400">{asset.expectedReturn}% PA</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                       <span className="text-gray-400">Min. Investment</span>
                       <span className="font-mono text-white">1 Token</span>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <a href="#invest" className="flex items-center justify-center w-full py-4 bg-celestial-orange hover:bg-celestial-orange-hover text-black font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(255,106,26,0.2)]">
                   Simulate Investment
                 </a>
                 <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Asset verified & structured via SPV</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Deep Dive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           <div className="lg:col-span-2 space-y-12">
              {/* Token Distribution */}
              <section>
                 <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <PieChart size={24} className="text-celestial-orange" /> Token Distribution
                 </h3>
                 <div className="glass-panel p-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-48 h-48 shrink-0">
                       <ResponsiveContainer width="100%" height="100%">
                         <RechartsPie>
                           <Pie
                             data={pieData}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                             stroke="transparent"
                           >
                             {pieData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Pie>
                           <Tooltip contentStyle={{ backgroundColor: '#181818', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                         </RechartsPie>
                       </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-celestial-orange"></span> Available</div>
                          <span className="font-mono">{pieData[0].value}%</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-celestial-blue"></span> Sold</div>
                          <span className="font-mono">{pieData[1].value}%</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#333]"></span> Reserved/Developer</div>
                          <span className="font-mono">{pieData[2].value}%</span>
                       </div>
                       <div className="pt-4 mt-2 border-t border-white/5">
                          <p className="text-xs text-gray-500 leading-relaxed">
                             Tokens represent proportional ownership in the holding SPV. Total supply is fixed at {asset.totalSupply.toLocaleString()} tokens.
                          </p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Returns Model */}
              <section>
                 <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <TrendingUp size={24} className="text-emerald-400" /> Income & Returns Model
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 border border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent">
                       <h4 className="text-sm text-gray-400 mb-2">Net Rental Yield</h4>
                       <p className="text-3xl font-bold text-emerald-400 mb-2">6.5% <span className="text-sm font-normal text-gray-500">PA</span></p>
                       <p className="text-xs text-gray-500">Distributed monthly directly to token holders' wallets in USDC or equivalent stablecoin (simulated).</p>
                    </div>
                    <div className="glass-panel p-6 border border-celestial-blue/10 bg-gradient-to-br from-celestial-blue/5 to-transparent">
                       <h4 className="text-sm text-gray-400 mb-2">Cap. Appreciation (Est.)</h4>
                       <p className="text-3xl font-bold text-celestial-blue mb-2">{asset.expectedReturn - 6.5}% <span className="text-sm font-normal text-gray-500">PA</span></p>
                       <p className="text-xs text-gray-500">Property value appreciation based on historical local market data and upcoming infrastructural projects.</p>
                    </div>
                 </div>
              </section>

              {/* Documentation & Trust */}
              <section>
                 <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <Info size={24} className="text-gray-400" /> Property Details & Legal
                 </h3>
                 <div className="glass-panel p-6">
                    <div className="grid grid-cols-2 gap-y-6">
                       <div>
                         <p className="text-xs text-gray-500 mb-1">Asset Category</p>
                         <p className="text-sm font-semibold">{asset.type === 'real-estate' ? 'Premium Residential' : 'Commercial'}</p>
                       </div>
                       <div>
                         <p className="text-xs text-gray-500 mb-1">Developer</p>
                         <p className="text-sm font-semibold">Tier-1 Global Dev (Mock)</p>
                       </div>
                       <div>
                         <p className="text-xs text-gray-500 mb-1">Status</p>
                         <p className="text-sm font-semibold text-emerald-400">{asset.status}</p>
                       </div>
                       <div>
                         <p className="text-xs text-gray-500 mb-1">Holding Period</p>
                         <p className="text-sm font-semibold">5 Years (Target)</p>
                       </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5">
                       <h4 className="font-bold mb-4">Documentation (Simulated)</h4>
                       <div className="space-y-3">
                         {['Legal Structure Overview', 'SPV Incorporation Details', 'Asset Verification Report', 'Title Deed (Redacted)'].map((doc, i) => (
                           <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#181818] hover:bg-[#222] transition-colors border border-white/5 cursor-pointer">
                              <span className="text-sm text-gray-300">{doc}</span>
                              <span className="text-xs text-celestial-orange font-medium">View PDF</span>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
              </section>
           </div>
           
           {/* Sidebar: Investment Panel */}
           <div className="relative">
              <div id="invest" className="glass-panel p-6 sticky top-36">
                 <h3 className="text-xl font-bold mb-6">Execution Panel</h3>
                 
                 <div className="space-y-6">
                   <div>
                     <label className="text-sm text-gray-400 mb-2 block">Investment Amount (₹)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                           type="number"
                           value={amount}
                           onChange={e => setAmount(e.target.value)}
                           className="w-full bg-[#121212] border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-celestial-orange transition-colors"
                           placeholder="100000"
                        />
                     </div>
                   </div>

                   <div className="p-4 bg-[#121212] rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Tokens Received</span>
                         <span className="font-mono text-celestial-orange font-bold">{tokens > 0 ? tokens.toFixed(2) : '0.00'} TKN</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Est. Monthly Income</span>
                         <span className="font-mono text-emerald-400">{amount ? `₹${((parseFloat(amount) * 0.065) / 12).toFixed(2)}` : '₹0.00'}</span>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-white text-black hover:bg-celestial-orange hover:text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98]">
                      Simulate Buy Transaction
                   </button>
                   
                   <p className="text-center text-[10px] text-gray-500 uppercase tracking-wide">
                     Prototype Phase • Simulated Funds
                   </p>
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Invest Feed</h4>
                    <div className="space-y-4">
                       {[
                         { user: '0x8a...4b', amt: '150', time: '5m' },
                         { user: '0x12...9f', amt: '45', time: '12m' },
                         { user: '0x7c...2a', amt: '1000', time: '1h' },
                       ].map((tx, i) => (
                         <div key={i} className="flex justify-between items-center bg-[#121212] p-2 rounded-lg text-xs">
                            <span className="font-mono text-gray-500">{tx.user}</span>
                            <span className="font-bold text-gray-300">{tx.amt} TKN</span>
                            <span className="text-gray-600">{tx.time}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
