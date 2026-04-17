"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, TrendingUp, DollarSign, ShieldCheck, Globe } from "lucide-react";
import { mockAssets, AssetType } from "@/lib/mock-data";
import Image from "next/image";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<AssetType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAssets = mockAssets.filter(asset => {
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (asset.location && asset.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const featuredAssets = mockAssets.filter(a => a.isFeatured);

  return (
    <div className="w-full">
      {/* Header Area */}
      <section className="pt-12 pb-8 px-6 bg-[#121212] border-b border-white/5 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Explore Assets</h1>
              <p className="text-gray-400">Discover and participate in premium tokenized assets.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search assets, locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181818] border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-celestial-orange transition-colors"
              />
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            {/* Tabs */}
            <div className="flex p-1 bg-[#181818] rounded-full inline-flex border border-white/5">
              {(['all', 'gold', 'real-estate'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-[#2A2A2A] text-white shadow-md' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            
            {/* Small Trust Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
               <ShieldCheck size={14} />
               <span>Verified Structure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Strip */}
      {searchQuery === '' && activeTab === 'all' && (
        <section className="py-12 bg-[#0A0A0A]">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-xl font-bold mb-6 text-gray-200">Featured Opportunities</h2>
            <div className="flex overflow-x-auto pb-8 gap-6 snap-x hide-scrollbar">
              {featuredAssets.map(asset => (
                <Link href={`/${asset.type}`} key={`featured-${asset.id}`} className="min-w-[320px] md:min-w-[400px] snap-start group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-celestial-orange/50 transition-colors">
                  <div className="h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 z-10 transition-colors" />
                    <img src={asset.image} alt={asset.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-xs font-semibold text-white uppercase tracking-wide">
                      {asset.type.replace('-', ' ')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-celestial-orange transition-colors">{asset.name}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} className="text-emerald-400" />
                        <span className="text-emerald-400">{asset.expectedReturn}% Return</span>
                      </div>
                      <span className="font-semibold text-white">₹{asset.tokenPrice.toLocaleString()}/token</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="py-12 bg-[#121212] min-h-[50vh]">
        <div className="container mx-auto px-6 max-w-7xl">
          {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-60">
               <Globe size={64} className="text-gray-600 mb-6" />
               <h3 className="text-2xl font-bold text-gray-400">No assets found</h3>
               <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredAssets.map(asset => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/${asset.type}`} className="block h-full shadow-lg">
                      <div className="h-full rounded-2xl bg-[#181818] border border-white/5 hover:border-celestial-orange/30 transition-all duration-300 overflow-hidden group flex flex-col relative hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="h-48 relative overflow-hidden shrink-0">
                          <img src={asset.image} alt={asset.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80" />
                          <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-celestial-orange border border-celestial-orange/20">
                            {asset.status}
                          </div>
                        </div>
                        
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-celestial-orange transition-colors">{asset.name}</h3>
                            {asset.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span>{asset.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Token Price</span>
                              <span className="font-semibold text-white flex items-center gap-1"><DollarSign size={14} className="text-gray-400" /> {asset.tokenPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500 mb-1">Exp. Return</span>
                              <span className="font-semibold text-emerald-400">{asset.expectedReturn}% PA</span>
                            </div>
                          </div>
                          
                          <div className="w-full">
                            <div className="flex justify-between text-xs mb-2">
                              <span className="text-gray-400">Filled</span>
                              <span className="text-white font-medium">{asset.fundedPercentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-celestial-orange transition-all duration-1000"
                                style={{ width: `${asset.fundedPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Compliance Strip */}
      <div className="w-full bg-[#0A0A0A] border-t border-white/5 py-4 text-center">
        <Link href="/compliance" className="text-xs text-gray-500 hover:text-white transition-colors inline-block">
          All assets follow structured compliance & verification layers (view details)
        </Link>
      </div>
    </div>
  );
}
