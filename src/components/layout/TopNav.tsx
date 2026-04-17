"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Wallet } from "lucide-react";

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Assets", path: "/assets" },
    { name: "Gold", path: "/gold" },
    { name: "Real Estate", path: "/real-estate" },
    { name: "Market", path: "/market" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold tracking-wider">
          <span className="text-white">S O V R I I G</span>
          <span className="text-celestial-orange"> N E</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-celestial-orange" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <Link href="/wallet">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center space-x-2 bg-celestial-surface border border-white/10 px-4 py-2 rounded-full text-sm font-medium hover:border-celestial-orange transition-colors"
            >
              <Wallet size={16} className="text-celestial-orange" />
              <span>Connect Wallet</span>
            </motion.button>
          </Link>
          <Link href="/profile">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full bg-celestial-surface border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors"
            >
              <User size={18} className="text-gray-300" />
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
