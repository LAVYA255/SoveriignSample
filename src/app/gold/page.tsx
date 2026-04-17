"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PriceChart from "@/components/charts/PriceChart";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export default function GoldPage() {
  const [active, setActive] = useState<TimeRange>('1W');
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  
  const tokenPrice = 5800;
  const tokens = amount ? parseFloat(amount) / tokenPrice : 0;

  return (
    <div className="w-full relative">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/assets" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to Assets
          </Link>
          <div className="flex gap-4">
             <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">Dashboard</Link>
             <Link href="/wallet" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">Wallet</Link>
             <Link href="/profile" className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:block">Profile</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Layout - 2 Cols (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* HERO / OVERVIEW */}
            <section className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-celestial-gold/40 to-[#181818] flex items-center justify-center border border-celestial-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] relative">
                 <div className="absolute inset-2 border border-celestial-gold/30 rounded-full border-dashed animate-[spin_30s_linear_infinite]" />
                 <span className="text-5xl md:text-6xl font-serif text-celestial-gold">Au</span>
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-[#181818] border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                  Digitally Tokenized Gold
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Gold Reserve Alpha</h1>
                <p className="text-gray-400 mb-6 flex-wrap">Backed by physical reserves (simulated). Providing stability and liquidity through fractional ownership.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Token Price</h4>
                    <p className="text-xl font-bold font-mono">₹{tokenPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Total Supply</h4>
                    <p className="text-xl font-bold">1M <span className="text-sm font-normal text-gray-500">tokens</span></p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Total Backing</h4>
                    <p className="text-xl font-bold">100kg</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">24h Change</h4>
                    <p className="text-xl font-bold text-emerald-400">+1.2%</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CHART */}
            <section className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Price History</h3>
                <div className="flex gap-2">
                 {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeRange[]).map(t => (
                   <button
                     key={t}
                     onClick={() => setActive(t)}
                     className={`px-2 py-1 rounded-md text-xs font-medium ${
                       t === active
                         ? 'bg-[#2A2A2A] text-white'
                         : 'text-gray-500 hover:text-gray-300'
                     }`}
                    >
                     {t}
                    </button>
                  ))}
                </div>
              </div>
              <PriceChart active={active} />
            </section>

            {/* BACKING DETAILS */}
            <section className="space-y-6">
              <h3 className="text-2xl font-bold">Reserve Backing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6">
                  <h4 className="text-sm text-gray-500 mb-2">Reserve Type</h4>
                  <p className="text-lg font-semibold text-white">Physical Gold</p>
                  <p className="text-xs text-celestial-gold mt-1">(simulated)</p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-sm text-gray-500 mb-2">Storage Model</h4>
                  <p className="text-lg font-semibold text-white">Secured Vault Custody</p>
                </div>
                <div className="glass-panel p-6">
                  <h4 className="text-sm text-gray-500 mb-2">Token Allocation</h4>
                  <p className="text-lg font-semibold text-white">1 token = 0.1 grams</p>
                </div>
              </div>
              
              <div className="glass-panel p-6">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-semibold">Backing Verification Status</h4>
                   <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><CheckCircle size={14}/> 100% Backed</span>
                 </div>
                 <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
                 </div>
                 <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                   *This is a prototype environment. Production systems utilize multi-signature audited vaults and periodic proof-of-reserve attestation.
                 </p>
              </div>
            </section>
          </div>

          {/* Right Col - Trading Panel & Info */}
          <div className="space-y-6 lg:sticky lg:top-36 self-start">
            
            {/* Trade Panel */}
            <div className="glass-panel p-1 rounded-2xl bg-[#121212]">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-xl font-bold mb-4">Trade Tokens</h3>
                <div className="flex p-1 bg-black rounded-xl mb-6">
                  <button 
                    onClick={() => setTradeMode('buy')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeMode === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
                  >Buy</button>
                  <button 
                    onClick={() => setTradeMode('sell')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tradeMode === 'sell' ? 'bg-red-500/10 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
                  >Sell</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">₹</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-celestial-gold transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-black rounded-xl border border-white/5">
                     <span className="text-sm text-gray-500">Estimated Tokens</span>
                     <span className="font-mono text-celestial-gold">{tokens > 0 ? tokens.toFixed(4) : '0.0000'}</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 mt-6 rounded-xl font-bold text-black transition-colors ${tradeMode === 'buy' ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-red-500 hover:bg-red-400'}`}
                >
                  Simulate {tradeMode.charAt(0).toUpperCase() + tradeMode.slice(1)}
                </motion.button>
                <p className="text-center text-[10px] text-gray-500 mt-4 truncate">Transactions are simulated in prototype environment.</p>
              </div>
            </div>

            {/* Security Strip */}
            <div className="glass-panel p-5 bg-[#181818]/30">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400">System Integrity</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Fixed supply mechanism</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Controlled minting process</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Hybrid custody model</li>
              </ul>
            </div>

            {/* Transaction Activity */}
            <div className="glass-panel p-5 bg-[#181818]/30">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400">Recent Activity</h4>
              <div className="space-y-4">
                {[
                  { type: 'buy', amount: '25.5000', time: '2m ago' },
                  { type: 'buy', amount: '12.0000', time: '5m ago' },
                  { type: 'sell', amount: '8.2500', time: '12m ago' },
                  { type: 'buy', amount: '100.0000', time: '18m ago' },
                ].map((tx, i) => (
                   <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${tx.type === 'buy' ? 'bg-emerald-400' : 'bg-red-500'}`} />
                         <span className="text-gray-300 uppercase">{tx.type}</span>
                      </div>
                      <span className="font-mono text-gray-300">{tx.amount}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> {tx.time}</span>
                   </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Compliance Strip */}
      <div className="w-full bg-[#0A0A0A] border-t border-white/10 py-4 text-center">
        <Link href="/compliance" className="text-xs text-yellow-500/80 hover:text-yellow-400 transition-colors inline-block font-medium">
          Full compliance & verification layers exist in production environment → View Compliance Structure
        </Link>
      </div>
    </div>
  );
}
