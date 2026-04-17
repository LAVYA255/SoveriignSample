"use client";

import { useState } from "react";
import PriceChart from "@/components/charts/PriceChart";
import { mockAssets } from "@/lib/mock-data";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import Link from "next/link";

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export default function MarketPage() {
  const [active, setActive] = useState<TimeRange>('1W');
  const [selectedToken, setSelectedToken] = useState(mockAssets[0]);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');

  const tokens = amount ? parseFloat(amount) / selectedToken.tokenPrice : 0;

  return (
    <div className="w-full relative h-[calc(100vh-80px)] overflow-hidden flex flex-col bg-[#0A0A0A]">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden border-t border-white/5">
         
         {/* Left col: Token List */}
         <div className="w-full lg:w-80 border-r border-white/5 bg-[#0A0A0A] flex flex-col h-[30vh] lg:h-full overflow-y-auto hide-scrollbar">
            <div className="p-4 border-b border-white/5 sticky top-0 bg-[#0A0A0A] z-10">
               <h2 className="font-bold text-gray-200">Markets</h2>
            </div>
            <div className="flex-1 p-2 space-y-1">
               {mockAssets.map(asset => (
                 <button 
                   key={asset.id}
                   onClick={() => setSelectedToken(asset)}
                   className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center ${selectedToken.id === asset.id ? 'bg-[#181818] border border-white/10' : 'hover:bg-[#121212] border border-transparent'}`}
                 >
                    <div>
                      <p className={`font-semibold text-sm ${selectedToken.id === asset.id ? 'text-white' : 'text-gray-400'}`}>{asset.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{asset.type.replace('-', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-gray-200">₹{asset.tokenPrice.toLocaleString()}</p>
                      <p className={`text-xs flex items-center justify-end ${asset.expectedReturn > 10 ? 'text-emerald-400' : 'text-emerald-500'}`}>
                         <ArrowUpRight size={12} /> {asset.expectedReturn}%
                      </p>
                    </div>
                 </button>
               ))}
            </div>
         </div>

         {/* Center col: Chart */}
         <div className="flex-1 bg-[#121212] flex flex-col h-[40vh] lg:h-full overflow-hidden border-b lg:border-b-0 border-white/5">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0A0A0A] gap-4">
               <div className="flex items-center gap-4">
                 <img src={selectedToken.image} alt={selectedToken.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                 <div>
                   <h2 className="text-xl font-bold">{selectedToken.name}</h2>
                   <div className="flex gap-4 mt-1">
                      <span className="font-mono text-emerald-400 font-medium">₹{selectedToken.tokenPrice.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">24h Vol: ₹1.2Cr</span>
                   </div>
                 </div>
               </div>
               <div className="flex bg-[#181818] p-1 rounded-lg border border-white/5">
                  {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeRange[]).map(t => (
                     <button
                       key={t}
                       onClick={() => setActive(t)}
                       className={`px-2 py-1 rounded-md text-xs font-semibold ${
                         active === t
                           ? 'bg-[#2A2A2A] text-white shadow'
                           : 'text-gray-500 hover:text-white'
                       }`}
                     > 
                       {t}
                     </button>
                  ))}
               </div>
            </div>
            
            <div className="flex-1 p-6 relative flex flex-col justify-center">
               <div className="w-full h-full min-h-[250px] relative z-20">
                 <PriceChart active={active} />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[150px] font-bold text-white/[0.02] pointer-events-none select-none z-10 tracking-widest">
                 {selectedToken.type === 'gold' ? 'GOLD' : 'PROP'}
               </div>
            </div>

            {/* Bottom panel: Order Activity */}
            <div className="h-48 border-t border-white/5 bg-[#0A0A0A] p-4 overflow-y-auto hide-scrollbar hidden xl:block">
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Network Trades</h3>
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500">
                     <tr>
                        <th className="pb-2 font-normal">Time</th>
                        <th className="pb-2 font-normal">Type</th>
                        <th className="pb-2 font-normal">Price</th>
                        <th className="pb-2 font-normal">Amount</th>
                        <th className="pb-2 font-normal text-right">Total (₹)</th>
                     </tr>
                  </thead>
                  <tbody className="text-gray-300 font-mono">
                     {Array.from({length: 6}).map((_, i) => (
                        <tr key={i} className="border-t border-white/5 hover:bg-[#121212]">
                           <td className="py-2 text-gray-500">{(new Date(Date.now() - i * 60000)).toLocaleTimeString()}</td>
                           <td className={i % 2 === 0 ? 'text-emerald-400' : 'text-red-500'}>{i % 2 === 0 ? 'BUY' : 'SELL'}</td>
                           <td className="py-2">₹{selectedToken.tokenPrice - (i*10)}</td>
                           <td className="py-2">{(Math.random() * 10).toFixed(4)}</td>
                           <td className="py-2 text-right">₹{((Math.random() * 10) * selectedToken.tokenPrice).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Right col: Trading */}
         <div className="w-full lg:w-80 bg-[#0A0A0A] border-l border-white/5 p-6 h-auto lg:h-full flex flex-col z-20">
            <h3 className="font-bold mb-6">Execution Panel</h3>
            
            <div className="flex p-1 bg-[#121212] rounded-xl mb-6 border border-white/5">
              <button 
                onClick={() => setTradeMode('buy')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeMode === 'buy' ? 'bg-[#181818] text-emerald-400 border border-white/5 shadow-md' : 'text-gray-500 hover:text-white'}`}
              >Buy</button>
              <button 
                onClick={() => setTradeMode('sell')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeMode === 'sell' ? 'bg-[#181818] text-red-500 border border-white/5 shadow-md' : 'text-gray-500 hover:text-white'}`}
              >Sell</button>
            </div>

            <div className="space-y-4 flex-1">
               <div>
                  <div className="flex justify-between text-xs mb-2">
                     <span className="text-gray-500">Order Type</span>
                     <span className="text-celestial-orange">Market</span>
                  </div>
                  <div className="w-full bg-[#121212] border border-white/5 rounded-xl p-3 text-sm text-gray-400">
                     Market Execution
                  </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500">Amount (₹)</span>
                    <span className="text-gray-500">Bal: <span className="text-white">₹2,50,000</span></span>
                 </div>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">₹</span>
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="0.00"
                     className="w-full bg-[#121212] border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-celestial-orange transition-colors"
                   />
                 </div>
               </div>
               
               <div className="p-4 bg-[#121212] rounded-xl border border-white/5 mt-4 space-y-2">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Asset Price</span>
                    <span className="font-mono text-gray-300">₹{selectedToken.tokenPrice.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tokens</span>
                    <span className="font-mono text-white font-bold">{tokens > 0 ? tokens.toFixed(4) : '0.0000'}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Platform Fee</span>
                    <span className="font-mono text-green-500">Free (Beta)</span>
                 </div>
               </div>
            </div>
            
            <div className="mt-6 pb-6">
               <button 
                 className={`w-full py-4 rounded-xl font-bold text-black transition-all active:scale-95 shadow-lg ${tradeMode === 'buy' ? 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20' : 'bg-red-500 hover:bg-red-400 shadow-red-500/20'}`}
               >
                 Execute {tradeMode === 'buy' ? 'Buy' : 'Sell'}
               </button>
               <p className="text-center text-[10px] text-gray-500 mt-4 leading-relaxed">
                 By executing, you agree to the <Link href="/terms" className="text-celestial-orange hover:underline">Terms of Service</Link>. All trades are simulated.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
