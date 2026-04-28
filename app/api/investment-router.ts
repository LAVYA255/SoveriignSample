import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { investments, transactions, assets, assetCategories } from "@db/schema";
import { eq, sql, and } from "drizzle-orm";
import { MOCK_INVESTMENTS } from "./mockData";

type InvestmentWithRelations = typeof investments.$inferSelect & {
  asset?: typeof assets.$inferSelect & { category?: typeof assetCategories.$inferSelect }
};

export const investmentRouter = createRouter({
  list: authedQuery.query(async ({ ctx: _ctx }) => {
    return MOCK_INVESTMENTS as unknown as InvestmentWithRelations[];
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: _ctx, input }) => {
      return MOCK_INVESTMENTS.find(i => i.id === input.id) as unknown as InvestmentWithRelations | undefined;
    }),

  create: authedQuery
    .input(
      z.object({
        assetId: z.number(),
        amount: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const asset = await db.query.assets.findFirst({
        where: eq(assets.id, input.assetId),
      });
      if (!asset) throw new Error("Asset not found");

      const expectedReturn = Number(input.amount) * (1 + Number(asset.expectedRoi) / 100);

      const [investment] = await db.insert(investments).values({
        userId: ctx.user.id,
        assetId: input.assetId,
        amount: input.amount,
        expectedReturn: expectedReturn.toString(),
        status: "active",
        startDate: new Date(),
        endDate: asset.endDate,
      });

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "investment",
        amount: input.amount,
        assetId: input.assetId,
        investmentId: Number(investment.insertId),
        status: "completed",
        description: `Invested Rs.${Number(input.amount).toLocaleString("en-IN")} in ${asset.name}`,
      });

      await db
        .update(assets)
        .set({
          fundedAmount: sql`${assets.fundedAmount} + ${input.amount}`,
          fundingProgress: sql`LEAST(100, (${assets.fundedAmount} + ${input.amount}) / ${assets.totalValue} * 100)`,
        })
        .where(eq(assets.id, input.assetId));

      return { success: true, investmentId: Number(investment.insertId) };
    }),

  exit: authedQuery
    .input(z.object({ investmentId: z.number(), exitPrice: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const investment = await db.query.investments.findFirst({
        where: and(
          eq(investments.id, input.investmentId),
          eq(investments.userId, ctx.user.id)
        ),
      });
      if (!investment) throw new Error("Investment not found");

      await db
        .update(investments)
        .set({
          status: "exited",
          exitedAt: new Date(),
          exitPrice: input.exitPrice,
          actualReturn: input.exitPrice,
        })
        .where(eq(investments.id, input.investmentId));

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "exit",
        amount: input.exitPrice,
        assetId: investment.assetId,
        investmentId: input.investmentId,
        status: "completed",
        description: `Exited investment for Rs.${Number(input.exitPrice).toLocaleString("en-IN")}`,
      });

      return { success: true };
    }),

  getPortfolioSummary: authedQuery.query(async ({ ctx: _ctx }) => {
    const userInvestments = MOCK_INVESTMENTS as any[];

    const activeInvestments = userInvestments.filter((i) => i.status === "active");
    const completedInvestments = userInvestments.filter((i) => i.status === "completed");
    const exitedInvestments = userInvestments.filter((i) => i.status === "exited");

    const totalInvested = userInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalReturns = userInvestments.reduce((sum, i) => sum + Number(i.actualReturn), 0);
    const activeValue = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
    const unrealizedReturns = activeInvestments.reduce(
      (sum, i) => sum + (Number(i.expectedReturn) - Number(i.amount)),
      0
    );

    const byCategory: Record<string, { name: string; value: number; count: number }> = {};
    for (const inv of activeInvestments) {
      const catName = inv.asset?.category?.name || "Other";
      if (!byCategory[catName]) {
        byCategory[catName] = { name: catName, value: 0, count: 0 };
      }
      byCategory[catName].value += Number(inv.amount);
      byCategory[catName].count += 1;
    }

    return {
      totalInvested,
      totalReturns,
      activeValue,
      unrealizedReturns,
      totalInvestments: userInvestments.length,
      activeCount: activeInvestments.length,
      completedCount: completedInvestments.length,
      exitedCount: exitedInvestments.length,
      byCategory: Object.values(byCategory),
      investments: userInvestments,
    };
  }),
});
