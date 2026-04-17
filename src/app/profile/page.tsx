"use client";

import { User, ShieldCheck, Mail, Phone, MapPin, Key, Shield, FileText } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="w-full">
      <div className="border-b border-white/5 bg-[#0A0A0A] sticky top-[72px] z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
             <User size={20} className="text-celestial-orange" /> Profile Details
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
         
         {/* Profile Card */}
         <div className="glass-panel p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-celestial-orange/5 rounded-full blur-[80px]" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
               <div className="w-32 h-32 rounded-full border border-white/10 bg-[#121212] overflow-hidden flex items-center justify-center relative">
                  <User size={48} className="text-gray-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                     <span className="text-xs text-white">Edit</span>
                  </div>
               </div>
               
               <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-3xl font-bold">John Doe</h2>
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20 font-bold tracking-wider uppercase">
                       <ShieldCheck size={14} /> Tier 2 Verified
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6">Premium RWA Investor (Prototype Profile)</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#121212] p-3 rounded-lg border border-white/5">
                        <Mail size={16} className="text-gray-500" /> john.doe@example.com
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#121212] p-3 rounded-lg border border-white/5">
                        <Phone size={16} className="text-gray-500" /> +91 98765 43210
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#121212] p-3 rounded-lg border border-white/5">
                        <MapPin size={16} className="text-gray-500" /> Mumbai, India
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-300 bg-[#121212] p-3 rounded-lg border border-white/5">
                        <Key size={16} className="text-gray-500" /> Connected Wallet: 0xA7F...92K
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
               <h3 className="font-bold flex items-center gap-2 mb-6"><Shield size={18} className="text-celestial-orange" /> Security & Identity</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4">
                     <span className="text-gray-400">KYC Status</span>
                     <span className="text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck size={14} /> Approved</span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4">
                     <span className="text-gray-400">Two-Factor Auth (2FA)</span>
                     <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4">
                     <span className="text-gray-400">Password</span>
                     <button className="text-gray-300 hover:text-white transition-colors underline">Change</button>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm">
                     <span className="text-gray-400">Account Type</span>
                     <span className="text-gray-200 font-medium">Retail Investor</span>
                  </div>
               </div>
            </div>

            <div className="glass-panel p-6">
               <h3 className="font-bold flex items-center gap-2 mb-6"><FileText size={18} className="text-celestial-orange" /> Legal & Preferences</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4">
                     <span className="text-gray-400">Notification Preferences</span>
                     <button className="text-gray-300 hover:text-white transition-colors underline">Edit</button>
                  </div>
                  <Link href="/terms" className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4 hover:bg-white/5 transition-colors cursor-pointer group">
                     <span className="text-gray-400 group-hover:text-white transition-colors">Terms of Service</span>
                     <span className="text-gray-500 flex items-center gap-1">View</span>
                  </Link>
                  <Link href="/compliance" className="flex justify-between items-center p-3 text-sm border-b border-white/5 pb-4 hover:bg-white/5 transition-colors cursor-pointer group">
                     <span className="text-gray-400 group-hover:text-white transition-colors">Compliance Hub</span>
                     <span className="text-gray-500 flex items-center gap-1">View</span>
                  </Link>
                  <Link href="/risk" className="flex justify-between items-center p-3 text-sm hover:bg-white/5 transition-colors cursor-pointer group">
                     <span className="text-gray-400 group-hover:text-white transition-colors">Risk Disclosures</span>
                     <span className="text-gray-500 flex items-center gap-1">View</span>
                  </Link>
               </div>
            </div>
         </div>

         <div className="mt-8 text-center pb-12">
            <button className="text-red-500 text-sm hover:text-red-400 transition-colors font-semibold">Sign Out (Simulated)</button>
         </div>
      </div>
    </div>
  );
}
