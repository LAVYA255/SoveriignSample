import { motion } from "framer-motion";
import { Shield, TrendingUp, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router";


const features = [
  { icon: TrendingUp, label: "12-15% ROI", desc: "Market-beating returns" },
  { icon: Shield, label: "Bank-Grade Security", desc: "Your assets are protected" },
  { icon: Lock, label: "RWA Backed", desc: "Real world asset collateral" },
  { icon: Zap, label: "Instant Liquidity", desc: "Trade anytime on marketplace" },
];

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="/assets/re-1.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-orange-950/50" />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          <div className="flex items-center gap-3">
            <img src="/astra-logo.png" alt="Astra" className="w-10 h-10" />
            <span className="text-xl font-bold text-white">
              Astra<span className="text-orange-500">RWA</span>
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Invest in Real World Assets
            </h1>
            <p className="text-lg text-neutral-400 mb-8 max-w-md">
              Access premium real estate, invoice financing, and supply chain investments with institutional-grade security.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4"
                >
                  <f.icon size={20} className="text-orange-400 mb-2" />
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs text-neutral-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/astra-logo.png" alt="Astra" className="w-10 h-10" />
            <span className="text-xl font-bold text-white">
              Astra<span className="text-orange-500">RWA</span>
            </span>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-sm text-neutral-400 mb-6">
              Sign in to access your investment portfolio
            </p>

            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Sign in with Kimi (Demo)
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-600">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Assets", value: "9+" },
              { label: "Investors", value: "2,500+" },
              { label: "TVL", value: "Rs.50Cr+" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
