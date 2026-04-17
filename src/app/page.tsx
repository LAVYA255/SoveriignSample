"use client";

import { motion } from "framer-motion";
import Hero3D from "@/components/home/Hero3D";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Coins } from "lucide-react";

const fadeIn: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <Hero3D />
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-16 pt-20">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight mb-6"
          >
            Tokenizing the world’s <br />
            <span className="text-gradient">most trusted assets</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Bridging physical assets and digital markets through a hybrid model of blockchain efficiency and institutional oversight. Value unlocked, redefined.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/assets" className="px-8 py-4 bg-celestial-orange hover:bg-celestial-orange-hover text-black font-semibold rounded-full transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(255,106,26,0.3)]">
              Launch Platform
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#understanding" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full border border-white/10 transition-all">
              Explore Model
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Section 1: Understanding RWA */}
      <section id="understanding" className="w-full py-32 bg-[#121212] relative z-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Understanding Real-World Assets</h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Real-world assets such as real estate and commodities hold significant value, yet access to them has traditionally been limited. High capital requirements, rigid ownership structures, and complex processes have made participation difficult for most individuals.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Globe, title: "Global Access", desc: "Break geographical barriers and access premium global assets from anywhere through fractional representations." },
              { icon: Coins, title: "Fractional Ownership", desc: "Acquire fractions of high-value assets without the need for total capital commitment, enhancing liquidity." },
              { icon: Shield, title: "Institutional Oversight", desc: "Hybrid structure ensuring full compliance, verifiable backing, and regulatory alignment for all tokenized assets." }
            ].map((f, i) => (
              <motion.div key={i} variants={fadeIn} className="glass-panel p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-celestial-orange/10 flex items-center justify-center mb-6 border border-celestial-orange/20">
                  <f.icon className="text-celestial-orange" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Info Section 2: Tokenomics & Gold */}
      <section className="w-full py-32 bg-[#0A0A0A] relative z-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">A Foundational Model: <br/><span className="text-gradient-gold">Gold-Backed Tokens</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Gold serves as a foundational example for understanding tokenized assets due to its measurable and widely recognized value.
            </p>
            <ul className="space-y-4 text-gray-500 mb-10">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-celestial-gold mt-2 shrink-0"></div>
                <span>Each token corresponds to a defined unit of physical gold reserve.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-celestial-gold mt-2 shrink-0"></div>
                <span>Provides a simple and intuitive way to understand how value can be represented digitally.</span>
              </li>
            </ul>
            <Link href="/gold" className="text-celestial-gold hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider group">
              Explore Gold Assets <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex-1 w-full relative"
          >
            <div className="aspect-square max-w-sm mx-auto relative group perspective-1000">
              <div className="absolute inset-0 bg-celestial-gold/20 blur-[100px] rounded-full"></div>
              <div className="w-full h-full rounded-full border border-celestial-gold/30 bg-[#181818]/60 backdrop-blur-md flex items-center justify-center relative z-10 animate-[spin_60s_linear_infinite]">
                 {/* Decorative rings */}
                 <div className="absolute inset-4 rounded-full border border-dashed border-celestial-gold/20 animate-[spin_40s_linear_infinite_reverse]"></div>
                 <div className="absolute inset-12 rounded-full border border-celestial-gold/10"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Coins size={80} className="text-celestial-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-40 bg-gradient-to-t from-[#050505] to-[#121212] relative z-20 border-t border-white/5">
         <div className="container mx-auto px-6 text-center max-w-4xl">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Experience a new approach to asset interaction
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 mb-12">
              Interact with tokenized assets, explore fractional ownership, and manage simulated portfolios.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <Link href="/assets" className="px-10 py-5 bg-white text-black hover:bg-celestial-orange hover:text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,106,26,0.3)] inline-flex items-center gap-3 text-lg group">
                Start Exploring <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
         </div>
      </section>
    </div>
  );
}
