import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { investments, transactions, feedback } from "@db/schema";
import { eq } from "drizzle-orm";


export const adminRouter = createRouter({
  getDashboardStats: adminQuery.query(async () => {
    return {
      totalUsers: 5,
      totalAssets: 12,
      totalInvestments: 20,
      totalTransactions: 45,
      totalAum: 5000000,
      totalInvested: 2500000,
      totalReturns: 150000,
      activeAssetCount: 8,
    };
  }),

  listUsers: adminQuery
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input: _input }) => {
      return [];
    }),

  listFeedback: adminQuery
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input: _input }) => {
      return [];
    }),

  updateFeedbackStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.enum(["open", "in_progress", "resolved", "closed"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(feedback).set({ status: input.status }).where(eq(feedback.id, input.id));
      return { success: true };
    }),

  triggerReturn: adminQuery
    .input(z.object({ investmentId: z.number(), returnAmount: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const investment = await db.query.investments.findFirst({
        where: eq(investments.id, input.investmentId),
      });
      if (!investment) throw new Error("Investment not found");

      await db
        .update(investments)
        .set({
          status: "completed",
          actualReturn: input.returnAmount,
        })
        .where(eq(investments.id, input.investmentId));

      await db.insert(transactions).values({
        userId: investment.userId,
        type: "return",
        amount: input.returnAmount,
        assetId: investment.assetId,
        investmentId: investment.id,
        status: "completed",
        description: `Return on investment: Rs.${Number(input.returnAmount).toLocaleString("en-IN")}`,
      });

      return { success: true };
    }),
});
