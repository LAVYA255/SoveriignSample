import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { transactions, users, assets, assetCategories } from "@db/schema";


type TransactionWithRelations = typeof transactions.$inferSelect & {
  user?: typeof users.$inferSelect;
  asset?: typeof assets.$inferSelect & { category?: typeof assetCategories.$inferSelect };
};

export const transactionRouter = createRouter({
  list: authedQuery
    .input(
      z.object({
        type: z.enum(["claim", "investment", "return", "exit", "withdrawal", "deposit", "fee"]).optional(),
        status: z.enum(["pending", "completed", "failed", "cancelled"]).optional(),
        limit: z.number().default(50),
      }).optional()
    )
    .query(async ({ ctx: _ctx, input: _input }) => {
      return [] as unknown as TransactionWithRelations[];
    }),

  create: authedQuery
    .input(
      z.object({
        type: z.enum(["claim", "investment", "return", "exit", "withdrawal", "deposit", "fee"]),
        amount: z.string(),
        assetId: z.number().optional(),
        investmentId: z.number().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [tx] = await db.insert(transactions).values({
        userId: ctx.user.id,
        ...input,
        status: "completed",
      });
      return tx;
    }),

  // Admin
  listAll: adminQuery
    .input(
      z.object({
        limit: z.number().default(100),
      }).optional()
    )
    .query(async ({ input: _input }) => {
      return [] as unknown as TransactionWithRelations[];
    }),

  getStats: adminQuery.query(async () => {
    return {
      totalTransactions: 0,
      totalVolume: 0,
      byType: [],
    };
  }),
});
