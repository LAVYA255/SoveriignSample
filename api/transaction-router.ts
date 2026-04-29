import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const transactionRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        type: z.enum(["deposit", "withdrawal", "investment", "return", "exit", "claim"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const response = await fetch(`${BACKEND_URL}/api/transactions/${ctx.user.id}`);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  getSummary: authedQuery.query(async () => {
    return { deposits: 0, withdrawals: 0, investments: 0, returns: 0 };
  }),

  getStats: authedQuery.query(async () => {
    return {
      totalTransactions: 0,
      totalVolume: 0,
      byType: []
    };
  }),
});
