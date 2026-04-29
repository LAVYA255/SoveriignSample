import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { marketListings, transactions, users, assets, assetCategories } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { MOCK_MARKET_LISTINGS } from "./mockData";

type MarketListingWithRelations = typeof marketListings.$inferSelect & {
  seller?: typeof users.$inferSelect;
  asset?: typeof assets.$inferSelect & { category?: typeof assetCategories.$inferSelect };
};

export const marketRouter = createRouter({
  list: publicQuery.query(async () => {
    return MOCK_MARKET_LISTINGS as unknown as MarketListingWithRelations[];
  }),

  createListing: authedQuery
    .input(
      z.object({
        assetId: z.number(),
        investmentId: z.number(),
        originalAmount: z.string(),
        listingPrice: z.string(),
        discountRate: z.string().default("0"),
        accruedValue: z.string().default("0"),
        expiryDays: z.number().default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [listing] = await db.insert(marketListings).values({
        sellerId: ctx.user.id,
        assetId: input.assetId,
        investmentId: input.investmentId,
        originalAmount: input.originalAmount,
        listingPrice: input.listingPrice,
        discountRate: input.discountRate,
        accruedValue: input.accruedValue,
        status: "active",
        expiryDate: new Date(Date.now() + input.expiryDays * 24 * 60 * 60 * 1000),
      });
      return { success: true, listingId: Number(listing.insertId) };
    }),

  buy: authedQuery
    .input(z.object({ listingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const listing = await db.query.marketListings.findFirst({
        where: eq(marketListings.id, input.listingId),
      });
      if (!listing) throw new Error("Listing not found");
      if (listing.sellerId === ctx.user.id) throw new Error("Cannot buy your own listing");

      await db
        .update(marketListings)
        .set({ status: "sold" })
        .where(eq(marketListings.id, input.listingId));

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "investment",
        amount: listing.listingPrice,
        assetId: listing.assetId,
        status: "completed",
        description: `Bought market listing for Rs.${Number(listing.listingPrice).toLocaleString("en-IN")}`,
      });

      return { success: true };
    }),

  cancel: authedQuery
    .input(z.object({ listingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(marketListings)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(marketListings.id, input.listingId),
            eq(marketListings.sellerId, ctx.user.id)
          )
        );
      return { success: true };
    }),
});
