"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { mockAssets } from "@/lib/mock-data";
import { ArrowRight, MapPin, TrendingUp, DollarSign } from "lucide-react";

export default function RealEstatePage() {
  const realEstateAssets = mockAssets.filter(a => a.type === 'real-estate');
  const featured = realEstateAssets.filter(a => a.isFeatured);
  const others = realEstateAssets.filter(a => !a.isFeatured);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 bg-[#0A0A0A] border-b border-white/5 relative z-10 overflow-hidden mt-10">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607688969-a5bfcd64bd40?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
         <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="max-w-2xl">
                 <h1 className="text-4xl md:text-6xl font-bold mb-4">Tokenized Real Estate Opportunities</h1>
                 <p className="text-xl text-gray-400">Access fractional ownership of premium global properties.</p>
               </div>
               
               <div className="flex gap-8 bg-[#181818]/80 backdrop-blur border border-white/10 p-6 rounded-2xl">
                 <div>
                   <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Est. Value</p>
                   <p className="text-3xl font-bold font-mono text-white">₹450M</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Avg Yield</p>
                   <p className="text-3xl font-bold text-emerald-400">11.4%</p>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* Featured Strip */}
      <section className="py-16 bg-[#121212]">
         <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-bold mb-8">Premium Offerings</h2>
            <div className="flex overflow-x-auto pb-8 gap-8 snap-x hide-scrollbar">
              {featured.map(asset => (
                <Link href={`/real-estate/${asset.id}`} key={`feat-${asset.id}`} className="min-w-[350px] md:min-w-[600px] snap-start group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-celestial-orange/50 transition-all duration-500 shadow-2xl">
                  <div className="h-64 md:h-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <img src={asset.image} alt={asset.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="flex items-center gap-2 mb-3">
                       <MapPin size={16} className="text-celestial-orange" />
                       <span className="text-sm font-medium text-gray-300">{asset.location}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-celestial-orange transition-colors">{asset.name}</h3>
                    <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs text-gray-400">Projected Yield</p>
                         <p className="text-lg font-bold text-emerald-400">{asset.expectedReturn}% PA</p>
                       </div>
                       <div className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-sm font-semibold flex items-center gap-2 transition-colors">
                          View Details <ArrowRight size={16} />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
         </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#0A0A0A]">
         <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-bold mb-8">Discover Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {realEstateAssets.map(asset => (
                 <Link href={`/real-estate/${asset.id}`} key={`grid-${asset.id}`} className="block h-full">
                    <div className="h-full rounded-2xl bg-[#121212] border border-white/5 hover:border-celestial-orange/30 transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-1">
                      <div className="h-48 relative overflow-hidden shrink-0">
                        <img src={asset.image} alt={asset.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-celestial-orange border border-celestial-orange/20">
                          {asset.status}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-celestial-orange transition-colors">{asset.name}</h3>
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
                            <span className="text-xs text-gray-500 mb-1">Exp. Yield</span>
                            <span className="font-semibold text-emerald-400">{asset.expectedReturn}% PA</span>
                          </div>
                        </div>
                        
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400">Tokens Sold</span>
                            <span className="text-white font-medium">{asset.fundedPercentage}%</span>
                          </div>
                          <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-celestial-orange transition-all duration-1000"
                              style={{ width: `${asset.fundedPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
