import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ArrowRight, TrendingUp, Calculator } from "lucide-react";
import { trpc } from "@/providers/trpc";
import type { Asset } from "@db/schema";

interface InvestModalProps {
  asset: Asset;
  onClose: () => void;
}

export default function InvestModal({ asset, onClose }: InvestModalProps) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "confirm" | "success">("input");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const { supabaseId, isLoading: authLoading } = useAuth();
  const createInvestment = trpc.investment.create.useMutation({
    onSuccess: () => {
      utils.investment.list.invalidate();
      utils.wallet.get.invalidate();
      utils.asset.list.invalidate();
      setStep("success");
    },
    onError: (err) => setError(err.message),
  });

  const walletQuery = trpc.wallet.get.useQuery(
    { supabaseId: supabaseId! }, 
    { enabled: !!supabaseId }
  );
  const balance = Number(walletQuery.data?.balance || 0);
  const minInv = Number(asset.minInvestment);
  const numericAmount = Number(amount);
  const expectedReturn = numericAmount * (1 + Number(asset.expectedRoi) / 100);

  const handleInvest = () => {
    setError("");
    if (!amount || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (numericAmount < minInv) {
      setError(`Minimum investment is Rs.${minInv.toLocaleString("en-IN")}`);
      return;
    }
    if (numericAmount > balance) {
      setError("Insufficient balance");
      return;
    }
    setStep("confirm");
  };

  const handleConfirm = () => {
    createInvestment.mutate({ assetId: String(asset.id), amount: amount });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/[0.08] rounded-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">
            {step === "success" ? "Investment Complete" : `Invest in ${asset.name}`}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors">
            <X size={18} className="text-neutral-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {authLoading || (!!supabaseId && walletQuery.isLoading) ? (
            <div className="flex justify-center p-8 text-neutral-500">
              Loading wallet...
            </div>
          ) : step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5 space-y-4"
            >
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Available Balance</label>
                <p className="text-2xl font-bold text-white">Rs.{balance.toLocaleString("en-IN")}</p>
              </div>

              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Investment Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">Rs.</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Min: Rs.${minInv.toLocaleString("en-IN")}`}
                    className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
                  />
                </div>
                <p className="text-xs text-neutral-600 mt-1.5">
                  Min: Rs.{minInv.toLocaleString("en-IN")} | Expected ROI: {asset.expectedRoi}%
                </p>
              </div>

              {numericAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white/[0.03] rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center gap-2 text-orange-400">
                    <Calculator size={16} />
                    <span className="text-sm font-medium">Return Projection</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Principal</span>
                    <span className="text-sm text-white">Rs.{numericAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Expected Return</span>
                    <span className="text-sm text-emerald-400 font-medium">
                      Rs.{Math.round(expectedReturn).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-px bg-white/[0.06]" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Net Profit</span>
                    <span className="text-sm font-bold text-emerald-400">
                      Rs.{Math.round(expectedReturn - numericAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </motion.div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleInvest}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5 space-y-4"
            >
              <div className="bg-white/[0.03] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Asset</span>
                  <span className="text-sm text-white font-medium">{asset.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Amount</span>
                  <span className="text-sm text-white font-medium">Rs.{numericAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Duration</span>
                  <span className="text-sm text-white font-medium">{asset.duration} {asset.durationUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Expected ROI</span>
                  <span className="text-sm text-orange-400 font-medium">{asset.expectedRoi}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Projected Return</span>
                  <span className="text-sm text-emerald-400 font-bold">
                    Rs.{Math.round(expectedReturn).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("input")}
                  className="flex-1 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={createInvestment.isPending}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {createInvestment.isPending ? "Processing..." : "Confirm Investment"}
                </button>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle size={64} className="text-emerald-400 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Investment Successful!</h3>
              <p className="text-neutral-400">
                You have successfully invested{" "}
                <span className="text-white font-medium">Rs.{numericAmount.toLocaleString("en-IN")}</span>{" "}
                in {asset.name}
              </p>
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">
                    Expected Return: Rs.{Math.round(expectedReturn).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
