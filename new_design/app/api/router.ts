import { authRouter } from "./auth-router";
import { assetRouter } from "./asset-router";
import { walletRouter } from "./wallet-router";
import { investmentRouter } from "./investment-router";
import { marketRouter } from "./market-router";
import { transactionRouter } from "./transaction-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  asset: assetRouter,
  wallet: walletRouter,
  investment: investmentRouter,
  market: marketRouter,
  transaction: transactionRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
