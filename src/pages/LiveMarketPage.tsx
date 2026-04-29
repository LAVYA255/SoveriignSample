import { motion } from "framer-motion";
import { TrendingUp, ArrowDownRight, Tag, Clock, User } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState } from "react";

export default function LiveMarketPage() {
  const { data: listings, isLoading } = trpc.market.list.useQuery();
  const [filter, setFilter] = useState<"all" | "best-deals">("all");

  const buyMutation = trpc.market.buy.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const filteredListings = listings?.filter((l: { discountRate: any; }) => {
    if (filter === "best-deals") return Number(l.discountRate) > 2;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Live Market</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Buy existing investments from other investors at discounted prices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-orange-600 text-white" : "bg-white/[0.05] text-neutral-400 hover:text-white"}`}
          >
            All Listings
          </button>
          <button
            onClick={() => setFilter("best-deals")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "best-deals" ? "bg-orange-600 text-white" : "bg-white/[0.05] text-neutral-400 hover:text-white"}`}
          >
            Best Deals
          </button>
        </div>
      </motion.div>

      {/* Simulated Live Ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-xl p-3 flex items-center gap-6 overflow-x-auto"
      >
        {[
          { label: "RE Commercial", price: "Rs.12.45M", change: "+2.3%" },
          { label: "Invoice Pool A", price: "Rs.8.2M", change: "+1.1%" },
          { label: "SCF Logistics", price: "Rs.15.8M", change: "-0.4%" },
          { label: "Palm Residences", price: "Rs.34.2M", change: "+3.2%" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 shrink-0">
            <div>
              <p className="text-xs text-neutral-500">{item.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.price}</span>
                <span className={`text-xs ${item.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Listings */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl h-24 animate-shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredListings?.map((listing: any, i: number) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.003 }}
              className="glass-card rounded-xl p-5 hover:border-orange-600/20 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Asset Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={listing.asset?.image || "/assets/re-1.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {listing.asset?.name || "Unknown Asset"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {listing.asset?.category?.name || ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {listing.seller?.name || "Anonymous"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Expires in {Math.ceil((new Date(listing.expiryDate || Date.now()).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-right shrink-0 mr-4">
                  <div className="flex items-center gap-1">
                    <Tag size={12} className="text-neutral-500" />
                    <span className="text-xs text-neutral-500">Listed at</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    Rs.{Number(listing.listingPrice).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Discount */}
                <div className="text-right shrink-0 mr-4">
                  <span className="text-xs text-neutral-500">Discount</span>
                  <p className="text-sm font-bold text-emerald-400">
                    <ArrowDownRight size={14} className="inline" />
                    {Number(listing.discountRate).toFixed(1)}%
                  </p>
                </div>

                {/* Accrued */}
                <div className="text-right shrink-0 mr-4 hidden md:block">
                  <span className="text-xs text-neutral-500">Accrued Value</span>
                  <p className="text-sm font-medium text-orange-400">
                    Rs.{Number(listing.accruedValue).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => buyMutation.mutate({ listingId: listing.id })}
                  disabled={buyMutation.isPending}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-[0.98] disabled:opacity-50 shrink-0"
                >
                  {buyMutation.isPending ? "..." : "Buy"}
                </button>
              </div>
            </motion.div>
          ))}
          {filteredListings?.length === 0 && (
            <div className="text-center py-16 glass-card rounded-xl">
              <TrendingUp size={48} className="text-neutral-700 mx-auto mb-4" />
              <p className="text-lg text-neutral-400">No listings available</p>
              <p className="text-sm text-neutral-600 mt-1">Check back later for new opportunities</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
