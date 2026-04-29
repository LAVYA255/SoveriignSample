import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const adminRouter = createRouter({
  getDashboardStats: adminQuery.query(async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/stats`);
    const result = await response.json() as any;
    if (!result.success) throw new Error(result.error);
    return result.data;
  }),

  listUsers: adminQuery
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async () => {
      const response = await fetch(`${BACKEND_URL}/api/admin/users`);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  getAllUsers: adminQuery.query(async () => {
    const response = await fetch(`${BACKEND_URL}/api/admin/users`);
    const result = await response.json() as any;
    if (!result.success) throw new Error(result.error);
    return result.data;
  }),

  creditWallet: adminQuery
    .input(z.object({ userId: z.string(), amount: z.number() }))
    .mutation(async ({ input }) => {
      const response = await fetch(`${BACKEND_URL}/api/admin/wallet/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    })
});
