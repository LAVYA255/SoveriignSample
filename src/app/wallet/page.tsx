"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowDownLeft, ArrowUpRight, History, ShieldCheck, Building, RefreshCcw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const mockTokens = [
  { name: 'Gold Reserve Alpha', symbol: 'GRA', balance: 215.5, value: 1249900 },
  { name: 'Dubai Marina Tower', symbol: 'DMT', balance: 100, value: 1200000 },
];

export default function WalletPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [viewMode, setViewMode] = useState<'fiat' | 'token'>('fiat');
  const [withdrawStep, setWithdrawStep] = useState<0 | 1 | 2>(0);
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto'>('bank');
  
  const fiatBalance = 250000;
  
  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleWithdrawSimulate = () => {
    setWithdrawStep(1); // Processing
    setTimeout(() => {
       setWithdrawStep(2); // Success
       setTimeout(() => setWithdrawStep(0), 3000); // Reset
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
             <Wallet size={20} className="text-celestial-orange" /> Wallet
          </h1>
          
          <div className="flex gap-4 items-center">
             <button onClick={() => setViewMode(viewMode === 'fiat' ? 'token' : 'fiat')} className="text-xs bg-[#181818] px-3 py-1.5 rounded-full border border-white/10 hover:border-celestial-orange transition-colors flex items-center gap-1">
                <RefreshCcw size={12} /> {viewMode === 'fiat' ? 'View Tokens' : 'View Fiat'}
             </button>
             {/* Wallet Connect Strip */}
             {isConnected ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-400">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                   0xA7F...92K
                </div>
             ) : (
                <button onClick={handleConnect} className="px-4 py-1.5 bg-white text-black font-semibold text-xs rounded-full hover:bg-gray-200 transition-colors">
                   Connect Wallet
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               
               {/* Total Balance Overview */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 relative overflow-hidden bg-gradient-to-br from-[#181818] to-[#121212]">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                     <Wallet size={150} />
                  </div>
                  <h2 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Total Available Balance</h2>
                  <div className="flex items-end gap-4 mb-2">
                     <p className="text-5xl md:text-7xl font-bold font-mono tracking-tight text-white">
                        {viewMode === 'fiat' ? `₹${fiatBalance.toLocaleString()}` : `${fiatBalance / 1000} GRA`}
                     </p>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                     <span className="text-emerald-400">+5.2%</span> Across all assets
                  </p>
                  
                  <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
                     <button className="px-6 py-3 bg-[#222] hover:bg-[#333] transition-colors rounded-xl text-sm font-semibold flex items-center gap-2 text-white">
                        <ArrowDownLeft size={16} /> Deposit (Simulated)
                     </button>
                     <p className="text-xs text-gray-500">Add funds to trade assets.</p>
                  </div>
               </motion.div>

               {/* Token Balances */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Wallet size={18} className="text-gray-400" /> Token Holdings</h3>
                  <div className="space-y-4">
                     {mockTokens.map(token => (
                        <div key={token.symbol} className="flex justify-between items-center p-4 bg-[#121212] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center font-bold text-gray-400 text-xs">
                                 {token.symbol}
                              </div>
                              <div>
                                 <h4 className="font-bold">{token.name}</h4>
                                 <p className="text-xs text-gray-500">{token.balance} Tokens</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-mono font-bold">₹{token.value.toLocaleString()}</p>
                              <p className="text-xs text-emerald-400">+2.4%</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>

               {/* Transaction History */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><History size={18} className="text-gray-400" /> Transaction History</h3>
                  <div className="space-y-4">
                     {[
                        { type: 'Buy', asset: 'GRA', amount: '215.5', status: 'Completed', date: 'Today, 10:45 AM' },
                        { type: 'Deposit', asset: 'INR', amount: '₹12,49,900', status: 'Completed', date: 'Today, 10:40 AM' },
                        { type: 'Buy', asset: 'DMT', amount: '100', status: 'Completed', date: 'Yesterday, 14:20 PM' },
                        { type: 'Withdraw', asset: 'INR', amount: '₹50,000', status: 'Pending', date: 'Yesterday, 09:15 AM' }
                     ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 last:pb-0">
                           <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                 tx.type === 'Buy' ? 'bg-emerald-500/10 text-emerald-400' :
                                 tx.type === 'Withdraw' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                 {tx.type === 'Withdraw' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm">{tx.type} {tx.asset}</h4>
                                 <p className="text-xs text-gray-500">{tx.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-mono font-bold text-sm">{tx.amount}</p>
                              <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                 {tx.status}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </div>

            {/* Withdraw Panel Sidebar */}
            <div className="relative">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 sticky top-36">
                  <h3 className="text-xl font-bold mb-6">Withdraw Funds</h3>
                  
                  <div className="space-y-6">
                     <div className="flex p-1 bg-[#121212] rounded-xl border border-white/5">
                        <button 
                           onClick={() => setWithdrawMethod('bank')}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${withdrawMethod === 'bank' ? 'bg-[#181818] text-white border border-white/5 shadow-md' : 'text-gray-500'}`}
                        >
                           <Building size={14} /> Bank Payout
                        </button>
                        <button 
                           onClick={() => setWithdrawMethod('crypto')}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${withdrawMethod === 'crypto' ? 'bg-[#181818] text-white border border-white/5 shadow-md' : 'text-gray-500'}`}
                        >
                           <Wallet size={14} /> Crypto Wallet
                        </button>
                     </div>

                     <div className="relative">
                        <label className="text-xs text-gray-400 mb-2 block font-medium">Withdrawal Amount ({withdrawMethod === 'bank' ? '₹' : 'USDC'})</label>
                        <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">
                              {withdrawMethod === 'bank' ? '₹' : '$'}
                           </span>
                           <input 
                              type="number"
                              className="w-full bg-[#121212] border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-celestial-orange transition-colors"
                              placeholder="10000"
                           />
                        </div>
                     </div>

                     <div className="p-4 bg-[#121212] rounded-xl border border-white/5">
                        <div className="flex justify-between text-sm mb-2">
                           <span className="text-gray-400">Target</span>
                           <span className="font-mono text-gray-200">
                              {withdrawMethod === 'bank' ? 'HDFC Bank **** 1234' : '0xA7F...92K'}
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-gray-400">Processing Time</span>
                           <span className="text-emerald-400">Instantly (Prototype)</span>
                        </div>
                     </div>

                     <AnimatePresence mode="wait">
                        {withdrawStep === 0 && (
                           <motion.button 
                              key="btn-0"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              onClick={handleWithdrawSimulate}
                              className="w-full py-4 bg-white text-black hover:bg-celestial-orange hover:text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
                           >
                              Confirm Withdrawal
                           </motion.button>
                        )}
                        {withdrawStep === 1 && (
                           <motion.div 
                              key="btn-1"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="w-full py-4 bg-[#222] text-white font-bold rounded-xl flex items-center justify-center gap-3 border border-white/10"
                           >
                              <div className="w-4 h-4 rounded-full border-2 border-celestial-orange border-t-transparent animate-spin" /> Processing via simulated gateway
                           </motion.div>
                        )}
                        {withdrawStep === 2 && (
                           <motion.div 
                              key="btn-2"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="w-full py-4 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 border border-emerald-500/30"
                           >
                              <CheckCircle size={18} /> Withdrawal Simulated
                           </motion.div>
                        )}
                     </AnimatePresence>
                     
                     <div className="pt-4 border-t border-white/5 space-y-2">
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                           <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
                           <p>Wallet secured via hybrid custody.</p>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                           <ShieldCheck size={14} className="shrink-0 text-emerald-500" />
                           <p>Transaction verification enabled.</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
         
      </div>
    </div>
  );
}
