import { Link } from "react-router";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-orange-600/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-orange-400">404</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-neutral-400 mb-6">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all"
        >
          <Home size={18} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
