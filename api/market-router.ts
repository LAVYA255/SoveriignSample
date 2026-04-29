import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const marketRouter = createRouter({
  list: publicQuery
    .input(z.object({ assetId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      let url = `${BACKEND_URL}/api/market`;
      if (input?.assetId) {
        url += `?assetId=${input.assetId}`;
      }
      const response = await fetch(url);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  createListing: authedQuery
    .input(
      z.object({
        investmentId: z.string(),
        sellAmount: z.string(),
        discountRate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await fetch(`${BACKEND_URL}/api/market/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: ctx.user.id,
          investmentId: input.investmentId,
          sellAmount: input.sellAmount,
          discountRate: input.discountRate
        })
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return { success: true, listingId: result.data.id };
    }),

  buy: authedQuery
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await fetch(`${BACKEND_URL}/api/market/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: ctx.user.id,
          listingId: input.listingId
        })
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return { success: true };
    }),

  // Stubs for remaining functions
  getListingsByAsset: publicQuery.input(z.object({ assetId: z.number() })).query(async () => []),
  getStats: publicQuery.query(async () => ({ totalVolume24h: 0, activeListings: 0, avgDiscount: 0 }))
});
