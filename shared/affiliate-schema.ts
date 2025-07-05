import { pgTable, serial, integer, text, timestamp, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { users, stores } from "./schema";

export const affiliateProgram = pgTable("affiliate_program", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  affiliateCode: text("affiliate_code").notNull().unique(),
  totalEarnings: doublePrecision("total_earnings").default(0),
  totalReferrals: integer("total_referrals").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateReferrals = pgTable("affiliate_referrals", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").notNull().references(() => affiliateProgram.id),
  referredUserId: integer("referred_user_id").notNull().references(() => users.id),
  storeId: integer("store_id").references(() => stores.id),
  commission: doublePrecision("commission").default(100), // ₹100 per referral
  status: text("status").default("pending"), // pending, paid, cancelled
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lifetimeDeals = pgTable("lifetime_deals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dealPrice: doublePrecision("deal_price").notNull().default(1499),
  originalPrice: doublePrecision("original_price").notNull().default(5988), // 12 months * 499
  spotsRemaining: integer("spots_remaining").default(100),
  isActive: boolean("is_active").default(true),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

export type AffiliateProgram = typeof affiliateProgram.$inferSelect;
export type AffiliateReferral = typeof affiliateReferrals.$inferSelect;
export type LifetimeDeal = typeof lifetimeDeals.$inferSelect;