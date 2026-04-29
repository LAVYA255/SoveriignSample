import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const walletRouter = createRouter({
  get: authedQuery
    .input(z.object({ supabaseId: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch(`${BACKEND_URL}/api/wallet/${input.supabaseId}`);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      
      return {
        userId: input.supabaseId,
        balance: result.data,
        totalInvested: "0",
        totalReturns: "0",
        claimedBalance: "0",
      };
    }),

  claimBalance: authedQuery
    .input(z.object({ amount: z.string().optional(), supabaseId: z.string() }))
    .mutation(async ({ input }) => {
      const response = await fetch(`${BACKEND_URL}/api/wallet/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: input.supabaseId })
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return { success: true, balance: result.data };
    }),

  // Keep these stubs if frontend relies on them, but they are now handled by backend engines
  updateAfterInvestment: authedQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  updateAfterReturn: authedQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  updateAfterExit: authedQuery
    .input(z.object({ investmentAmount: z.string(), exitAmount: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),
});
