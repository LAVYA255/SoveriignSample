import { relations } from "drizzle-orm";
import {
  users,
  wallets,
  assets,
  assetCategories,
  investments,
  transactions,
  marketListings,
  assetPerformance,
  notifications,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, { fields: [users.id], references: [wallets.userId] }),
  investments: many(investments),
  transactions: many(transactions),
  marketListings: many(marketListings),
  notifications: many(notifications),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
}));

export const assetCategoriesRelations = relations(assetCategories, ({ many }) => ({
  assets: many(assets),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  category: one(assetCategories, { fields: [assets.categoryId], references: [assetCategories.id] }),
  investments: many(investments),
  marketListings: many(marketListings),
  performance: many(assetPerformance),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, { fields: [investments.userId], references: [users.id] }),
  asset: one(assets, { fields: [investments.assetId], references: [assets.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  asset: one(assets, { fields: [transactions.assetId], references: [assets.id] }),
}));

export const marketListingsRelations = relations(marketListings, ({ one }) => ({
  seller: one(users, { fields: [marketListings.sellerId], references: [users.id] }),
  asset: one(assets, { fields: [marketListings.assetId], references: [assets.id] }),
}));

export const assetPerformanceRelations = relations(assetPerformance, ({ one }) => ({
  asset: one(assets, { fields: [assetPerformance.assetId], references: [assets.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
