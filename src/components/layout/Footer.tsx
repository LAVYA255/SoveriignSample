import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-16 pb-8 mt-auto z-10 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold tracking-wider">
              <span className="text-white">Celestia</span>
              <span className="text-celestial-orange">lE</span>
            </Link>
            <p className="text-xs text-gray-500 mt-2 max-w-sm">
              Prototype platform operating in a simulated/test environment. Not for real financial transactions.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/risk" className="hover:text-white transition-colors">Risk</Link>
            <Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
             <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-gray-300">System Status: Operational</span>
             </div>
             <p className="text-[10px] text-gray-600 mt-1">Simulated Environment</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-500">
          <p>&copy; 2026 CelestialE. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://x.com/celestial_31060" target="_blank" rel="noopener noreferrer" className="hover:text-celestial-orange">X (Twitter)</a>
            <a href="https://discord.gg/ERtH4hXtX" target="_blank" rel="noopener noreferrer" className="hover:text-celestial-orange">Discord</a>
            <a href="https://www.instagram.com/celestial._.e" target="_blank" rel="noopener noreferrer" className="hover:text-celestial-orange">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
