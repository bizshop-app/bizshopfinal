import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with enhanced roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").default("customer").notNull(), // customer, store_owner, admin, manager
  isAdmin: boolean("is_admin").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  subscriptionPlan: text("subscription_plan").default("free"), // free, pro, premium
  subscriptionStatus: text("subscription_status").default("trial"), // trial, active, expired, cancelled, paused
  trialEndsAt: timestamp("trial_ends_at"),
  razorpayCustomerId: text("razorpay_customer_id"),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  autoRenewal: boolean("auto_renewal").default(false),
  maxProducts: integer("max_products").default(0),
  maxStores: integer("max_stores").default(0),
});

// Store schema
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  template: text("template").default("boutique"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#3563E9"),
  accentColor: text("accent_color").default("#F97316"),
  fontFamily: text("font_family").default("Inter"),
  customDomain: text("custom_domain"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Collections schema
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product schema (enhanced)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  priceInr: doublePrecision("price_inr").notNull(),
  compareAtPrice: doublePrecision("compare_at_price"), // For showing discounts
  imageUrl: text("image_url"),
  tags: text("tags"), // Comma-separated tags for search
  sku: text("sku"),
  inventory: integer("inventory").default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product collections many-to-many
export const productCollections = pgTable("product_collections", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  collectionId: integer("collection_id").notNull().references(() => collections.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shopping cart schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For guest users
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Discount codes schema
export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // percentage, fixed_amount, free_shipping
  value: doublePrecision("value").notNull(), // percentage (0-100) or fixed amount
  minimumAmount: doublePrecision("minimum_amount"), // Minimum cart value
  usageLimit: integer("usage_limit"), // Total usage limit
  usageCount: integer("usage_count").default(0),
  isActive: boolean("is_active").default(true),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").default("pending"),
  totalAmount: doublePrecision("total_amount").notNull(),
  items: json("items").notNull(),
  paymentId: text("payment_id"),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Store managers schema for premium stores
export const storeManagers = pgTable("store_managers", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  permissions: json("permissions").notNull().default('{}'),
  invitedBy: integer("invited_by").notNull().references(() => users.id),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).omit({
  id: true,
  usageCount: true,
  createdAt: true,
});

export const insertProductCollectionSchema = createInsertSchema(productCollections).omit({
  id: true,
  createdAt: true,
});

// Create types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;
export type DiscountCode = typeof discountCodes.$inferSelect;

export type InsertProductCollection = z.infer<typeof insertProductCollectionSchema>;
export type ProductCollection = typeof productCollections.$inferSelect;

export const insertStoreManagerSchema = createInsertSchema(storeManagers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStoreManager = z.infer<typeof insertStoreManagerSchema>;
export type StoreManager = typeof storeManagers.$inferSelect;

// Template schema for frontend only
export type Template = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
};
