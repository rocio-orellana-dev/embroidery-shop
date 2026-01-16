import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  tier: text("tier").notNull(), // STANDARD, PRO, PREMIUM
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productFormats = pgTable("product_formats", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  format: text("format").notNull(), // JEF, DST, PES, etc.
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  format: text("format").notNull().default("JEF"), // ✅ NUEVO
  quantity: integer("quantity").default(1),
  addedAt: timestamp("added_at").defaultNow(),
});

// === RELATIONS ===

export const productRelations = relations(products, ({ many }) => ({
  formats: many(productFormats),
}));

export const productFormatsRelations = relations(productFormats, ({ one }) => ({
  product: one(products, {
    fields: [productFormats.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true,
});

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type ProductFormat = typeof productFormats.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type ProductWithFormats = Product & { formats: string[] };

export type ProductListResponse = ProductWithFormats[];
export type ProductResponse = ProductWithFormats;

export type CartItemWithDetails = CartItem & { product: Product };
export type CartResponse = CartItemWithDetails[];

// ✅ AHORA incluye format
export type AddToCartRequest = { productId: number; quantity?: number; format: string };
