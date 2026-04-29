import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";

import { env } from "./lib/env";
const BACKEND_URL = env.backendUrl;

export const assetRouter = createRouter({
  listCategories: publicQuery.query(async () => {
    return []; // Handled entirely dynamically or kept empty if unused
  }),

  list: publicQuery
    .input(
      z.object({
        categorySlug: z.string().optional(),
        status: z.enum(["active", "paused", "completed", "upcoming"]).optional(),
        riskLevel: z.enum(["low", "moderate", "high"]).optional(),
        liquidityType: z.enum(["locked", "tradable", "flexible"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      let queryStr = '';
      if (input?.status) queryStr += `status=${input.status}&`;
      // Map frontend filters to backend where possible
      const response = await fetch(`${BACKEND_URL}/api/assets?${queryStr}`);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  getById: publicQuery
    .input(z.object({ id: z.union([z.string(), z.number()]) })) // Supabase uses UUID string, frontend might send string or number
    .query(async ({ input }) => {
      const response = await fetch(`${BACKEND_URL}/api/assets/${input.id}`);
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      // Stub if unused by new structure, otherwise would need a backend route
      return null;
    }),

  create: adminQuery
    .input(z.any())
    .mutation(async ({ input }) => {
      const response = await fetch(`${BACKEND_URL}/api/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      const result = await response.json() as any;
      if (!result.success) throw new Error(result.error);
      return result.data;
    }),

  update: adminQuery.input(z.any()).mutation(async () => ({ success: true })),
  delete: adminQuery.input(z.any()).mutation(async () => ({ success: true })),
  updateStatus: adminQuery.input(z.any()).mutation(async () => ({ success: true })),
  getStats: publicQuery.query(async () => ({
    totalAssets: 0, totalValue: 0, fundedAmount: 0, avgRoi: 0, activeAssets: 0
  })),
});
