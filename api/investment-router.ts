import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const investmentRouter = createRouter({
  list: authedQuery.query(async () => {
    return [];
  }),

  getById: authedQuery
    .input(z.object({ id: z.union([z.string(), z.number()]) }))
    .query(async () => {
      return null;
    }),

  create: authedQuery
    .input(
      z.object({
        assetId: z.string(),
        amount: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const response = await fetch(`${BACKEND_URL}/api/invest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: ctx.user.id,
          assetId: input.assetId,
          amount: input.amount
        })
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  exit: authedQuery
    .input(z.object({ investmentId: z.union([z.string(), z.number()]), exitPrice: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  getPortfolioSummary: authedQuery.query(async () => {
    return {
      totalInvested: 0,
      totalReturns: 0,
      activeValue: 0,
      unrealizedReturns: 0,
      totalInvestments: 0,
      activeCount: 0,
      completedCount: 0,
      exitedCount: 0,
      byCategory: [],
      investments: [],
    };
  }),
});
