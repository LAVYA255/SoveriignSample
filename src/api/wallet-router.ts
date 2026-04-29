import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { wallets, transactions } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const walletRouter = createRouter({
  get: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    let wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, ctx.user.id),
    });

    if (!wallet) {
      await db.insert(wallets).values({
        userId: ctx.user.id,
        balance: "100000",
        totalInvested: "0",
        totalReturns: "0",
        claimedBalance: "0",
      });
      wallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, ctx.user.id),
      });
    }

    return wallet;
  }),

  claimBalance: authedQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const wallet = await db.query.wallets.findFirst({
        where: eq(wallets.userId, ctx.user.id),
      });
      if (!wallet) throw new Error("Wallet not found");

      await db
        .update(wallets)
        .set({
          balance: sql`${wallets.balance} + ${input.amount}`,
        })
        .where(eq(wallets.userId, ctx.user.id));

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "deposit",
        amount: input.amount,
        status: "completed",
        description: `Claimed balance: Rs.${Number(input.amount).toLocaleString("en-IN")}`,
      });

      return { success: true };
    }),

  updateAfterInvestment: authedQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(wallets)
        .set({
          balance: sql`${wallets.balance} - ${input.amount}`,
          totalInvested: sql`${wallets.totalInvested} + ${input.amount}`,
        })
        .where(eq(wallets.userId, ctx.user.id));
      return { success: true };
    }),

  updateAfterReturn: authedQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(wallets)
        .set({
          balance: sql`${wallets.balance} + ${input.amount}`,
          totalReturns: sql`${wallets.totalReturns} + ${input.amount}`,
        })
        .where(eq(wallets.userId, ctx.user.id));
      return { success: true };
    }),

  updateAfterExit: authedQuery
    .input(z.object({ investmentAmount: z.string(), exitAmount: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const profit = Number(input.exitAmount) - Number(input.investmentAmount);
      await db
        .update(wallets)
        .set({
          balance: sql`${wallets.balance} + ${input.exitAmount}`,
          totalInvested: sql`${wallets.totalInvested} - ${input.investmentAmount}`,
          totalReturns: sql`${wallets.totalReturns} + ${profit > 0 ? profit : 0}`,
        })
        .where(eq(wallets.userId, ctx.user.id));
      return { success: true };
    }),
});
