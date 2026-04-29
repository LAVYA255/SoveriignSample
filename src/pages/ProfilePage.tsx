import { motion } from "framer-motion";
import { UserCircle, Mail, Calendar, Wallet, TrendingUp, Shield, Settings, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

export default function ProfilePage() {
  const { user, userData, supabaseId, isLoading: authLoading } = useAuth();
  
  const { data: wallet, isLoading: walletLoading } = trpc.wallet.get.useQuery(
    { supabaseId: supabaseId! }, 
    { enabled: !!supabaseId }
  );
  const { data: summary } = trpc.investment.getPortfolioSummary.useQuery();

  if (authLoading || (!!supabaseId && walletLoading)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-orange-500">Loading Profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-neutral-400">Please sign in to view your profile</p>
      </div>
    );
  }

  // Combine auth user with DB data
  const profile = {
    name: userData?.username || user.displayName || "User",
    email: user.email,
    avatar: user.photoURL,
    role: userData?.role || "user",
    joinedAt: userData?.created_at || userData?.createdAt,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-orange-600/20 flex items-center justify-center mx-auto mb-4">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserCircle size={48} className="text-orange-400" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
        <p className="text-neutral-400 mt-1">{profile.email || "No email"}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${profile.role === "admin" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : "bg-white/5 text-neutral-400"}`}>
            {profile.role}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-neutral-500">
          <Calendar size={12} />
          <span>Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString("en-IN") : "Recently"}</span>
        </div>
      </motion.div>

      {/* Wallet Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Wallet size={16} className="text-orange-400" />
          Wallet Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Balance", value: `Rs.${Number(wallet?.balance || 0).toLocaleString("en-IN")}`, color: "text-white" },
            { label: "Total Invested", value: `Rs.${Number(wallet?.totalInvested || 0).toLocaleString("en-IN")}`, color: "text-orange-400" },
            { label: "Total Returns", value: `Rs.${Number(wallet?.totalReturns || 0).toLocaleString("en-IN")}`, color: "text-emerald-400" },
            { label: "Claimed", value: `Rs.${Number(wallet?.claimedBalance || 0).toLocaleString("en-IN")}`, color: "text-blue-400" },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.03] rounded-xl p-4 text-center">
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Investment Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-400" />
          Investment Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Investments", value: summary?.totalInvestments || 0 },
            { label: "Active", value: summary?.activeCount || 0 },
            { label: "Completed", value: summary?.completedCount || 0 },
            { label: "Exited", value: summary?.exitedCount || 0 },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.03] rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-white">{item.value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Settings size={16} className="text-neutral-400" />
          Settings
        </h3>
        <div className="space-y-3">
          {[
            { label: "Notification Preferences", icon: Bell, desc: "Manage alerts and emails" },
            { label: "Security", icon: Shield, desc: "Two-factor authentication" },
            { label: "Account Info", icon: Mail, desc: "Update email and details" },
          ].map((setting) => (
            <div
              key={setting.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
                <setting.icon size={16} className="text-neutral-400" />
              </div>
              <div>
                <p className="text-sm text-white">{setting.label}</p>
                <p className="text-xs text-neutral-500">{setting.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
