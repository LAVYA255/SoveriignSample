import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  bigint,
  boolean,
  json,
  date,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Wallets ─────────────────────────────────────────────
export const wallets = mysqlTable("wallets", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .unique(),
  balance: decimal("balance", { precision: 18, scale: 2 })
    .default("0")
    .notNull(),
  totalInvested: decimal("totalInvested", { precision: 18, scale: 2 })
    .default("0")
    .notNull(),
  totalReturns: decimal("totalReturns", { precision: 18, scale: 2 })
    .default("0")
    .notNull(),
  claimedBalance: decimal("claimedBalance", { precision: 18, scale: 2 })
    .default("0")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Wallet = typeof wallets.$inferSelect;

// ─── Asset Categories ────────────────────────────────────
export const assetCategories = mysqlTable("asset_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetCategory = typeof assetCategories.$inferSelect;

// ─── Assets ──────────────────────────────────────────────
export const assets = mysqlTable("assets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  image: text("image"),
  totalValue: decimal("totalValue", { precision: 18, scale: 2 }).notNull(),
  minInvestment: decimal("minInvestment", { precision: 18, scale: 2 }).notNull(),
  expectedRoi: decimal("expectedRoi", { precision: 5, scale: 2 }).notNull(),
  duration: int("duration").notNull(),
  durationUnit: mysqlEnum("durationUnit", ["days", "months", "years"]).default("months").notNull(),
  riskLevel: mysqlEnum("riskLevel", ["low", "moderate", "high"]).default("moderate").notNull(),
  status: mysqlEnum("status", ["active", "paused", "completed", "upcoming"]).default("upcoming").notNull(),
  liquidityType: mysqlEnum("liquidityType", ["locked", "tradable", "flexible"]).default("locked").notNull(),
  fundingProgress: decimal("fundingProgress", { precision: 5, scale: 2 }).default("0").notNull(),
  fundedAmount: decimal("fundedAmount", { precision: 18, scale: 2 }).default("0").notNull(),
  yieldGenerated: decimal("yieldGenerated", { precision: 18, scale: 2 }).default("0").notNull(),
  documents: json("documents"),
  metadata: json("metadata"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Asset = typeof assets.$inferSelect;

// ─── Investments ─────────────────────────────────────────
export const investments = mysqlTable("investments", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  assetId: bigint("assetId", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  expectedReturn: decimal("expectedReturn", { precision: 18, scale: 2 }).notNull(),
  actualReturn: decimal("actualReturn", { precision: 18, scale: 2 }).default("0").notNull(),
  roi: decimal("roi", { precision: 5, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "completed", "exited", "pending"]).default("pending").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  exitedAt: timestamp("exitedAt"),
  exitPrice: decimal("exitPrice", { precision: 18, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Investment = typeof investments.$inferSelect;

// ─── Transactions ────────────────────────────────────────
export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", [
    "claim",
    "investment",
    "return",
    "exit",
    "withdrawal",
    "deposit",
    "fee",
  ]).notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  assetId: bigint("assetId", { mode: "number", unsigned: true }),
  investmentId: bigint("investmentId", { mode: "number", unsigned: true }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  description: varchar("description", { length: 500 }),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Transaction = typeof transactions.$inferSelect;

// ─── Market Listings ─────────────────────────────────────
export const marketListings = mysqlTable("market_listings", {
  id: serial("id").primaryKey(),
  sellerId: bigint("sellerId", { mode: "number", unsigned: true }).notNull(),
  assetId: bigint("assetId", { mode: "number", unsigned: true }).notNull(),
  investmentId: bigint("investmentId", { mode: "number", unsigned: true }).notNull(),
  originalAmount: decimal("originalAmount", { precision: 18, scale: 2 }).notNull(),
  listingPrice: decimal("listingPrice", { precision: 18, scale: 2 }).notNull(),
  discountRate: decimal("discountRate", { precision: 5, scale: 2 }).default("0").notNull(),
  accruedValue: decimal("accruedValue", { precision: 18, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "sold", "cancelled", "expired"]).default("active").notNull(),
  expiryDate: timestamp("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type MarketListing = typeof marketListings.$inferSelect;

// ─── Asset Performance ───────────────────────────────────
export const assetPerformance = mysqlTable("asset_performance", {
  id: serial("id").primaryKey(),
  assetId: bigint("assetId", { mode: "number", unsigned: true }).notNull(),
  date: date("date").notNull(),
  navValue: decimal("navValue", { precision: 18, scale: 4 }).notNull(),
  yieldAccrued: decimal("yieldAccrued", { precision: 18, scale: 4 }).default("0").notNull(),
  aum: decimal("aum", { precision: 18, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssetPerformance = typeof assetPerformance.$inferSelect;

// ─── Notifications ───────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  type: mysqlEnum("type", ["info", "success", "warning", "error"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;

// ─── Feedback ────────────────────────────────────────────
export const feedback = mysqlTable("feedback", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["general", "bug", "feature", "support"]).default("general").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Feedback = typeof feedback.$inferSelect;
