import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { assets, assetCategories, assetPerformance } from "@db/schema";
import { eq } from "drizzle-orm";
import { MOCK_CATEGORIES, MOCK_ASSETS } from "./mockData";

type AssetWithRelations = typeof assets.$inferSelect & { 
  category?: typeof assetCategories.$inferSelect;
  performance?: typeof assetPerformance.$inferSelect[];
};

export const assetRouter = createRouter({
  // ── Categories ─────────────────────────────
  listCategories: publicQuery.query(async () => {
    return MOCK_CATEGORIES;
  }),

  // ── Assets ─────────────────────────────────
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
      let results = [...MOCK_ASSETS];
      if (input?.status) results = results.filter(a => a.status === input.status);
      if (input?.riskLevel) results = results.filter(a => a.riskLevel === input.riskLevel);
      if (input?.liquidityType) results = results.filter(a => a.liquidityType === input.liquidityType);
      if (input?.categorySlug) results = results.filter(a => a.category?.slug === input.categorySlug);
      return results as unknown as AssetWithRelations[];
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return MOCK_ASSETS.find(a => a.id === input.id) as unknown as AssetWithRelations | undefined;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return MOCK_ASSETS.find(a => a.slug === input.slug) as unknown as AssetWithRelations | undefined;
    }),

  // ── Admin ──────────────────────────────────
  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        categoryId: z.number(),
        description: z.string().optional(),
        location: z.string().optional(),
        image: z.string().optional(),
        totalValue: z.string(),
        minInvestment: z.string(),
        expectedRoi: z.string(),
        duration: z.number(),
        durationUnit: z.enum(["days", "months", "years"]).default("months"),
        riskLevel: z.enum(["low", "moderate", "high"]).default("moderate"),
        status: z.enum(["active", "paused", "completed", "upcoming"]).default("upcoming"),
        liquidityType: z.enum(["locked", "tradable", "flexible"]).default("locked"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [asset] = await db.insert(assets).values({
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
      });
      return asset;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        image: z.string().optional(),
        totalValue: z.string().optional(),
        minInvestment: z.string().optional(),
        expectedRoi: z.string().optional(),
        duration: z.number().optional(),
        riskLevel: z.enum(["low", "moderate", "high"]).optional(),
        status: z.enum(["active", "paused", "completed", "upcoming"]).optional(),
        liquidityType: z.enum(["locked", "tradable", "flexible"]).optional(),
        fundingProgress: z.string().optional(),
        fundedAmount: z.string().optional(),
        yieldGenerated: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(assets).set(data).where(eq(assets.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(assets).where(eq(assets.id, input.id));
      return { success: true };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "paused", "completed", "upcoming"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(assets)
        .set({ status: input.status })
        .where(eq(assets.id, input.id));
      return { success: true };
    }),

  // ── Stats ──────────────────────────────────
  getStats: publicQuery.query(async () => {
    const allAssets = MOCK_ASSETS;
    const totalValue = allAssets.reduce((sum, a) => sum + Number(a.totalValue), 0);
    const fundedAmount = allAssets.reduce((sum, a) => sum + Number(a.fundedAmount), 0);
    const avgRoi = allAssets.length > 0
      ? allAssets.reduce((sum, a) => sum + Number(a.expectedRoi), 0) / allAssets.length
      : 0;

    return {
      totalAssets: allAssets.length,
      totalValue,
      fundedAmount,
      avgRoi: Number(avgRoi.toFixed(2)),
      activeAssets: allAssets.filter((a) => a.status === "active").length,
    };
  }),
});
