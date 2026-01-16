import {
  users,
  products,
  productFormats,
  cartItems,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type CartItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(filters?: { search?: string; category?: string; sort?: string }): Promise<(Product & { formats: string[] })[]>;
  getProduct(id: number): Promise<(Product & { formats: string[] }) | undefined>;
  createProduct(product: InsertProduct & { formats?: string[] }): Promise<Product>;

  // Cart
  getCart(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: number, item: { productId: number; quantity: number; format: string }): Promise<CartItem>;
  removeFromCart(userId: number, id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(filters?: { search?: string; category?: string; sort?: string }) {
    const conditions = [];

    if (filters?.search?.trim()) {
      conditions.push(like(products.name, `%${filters.search.trim()}%`));
    }

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }

    // ✅ si no hay filtros, usamos TRUE para no romper .where()
    const whereClause = conditions.length ? and(...conditions) : sql`true`;

    const results = await db
      .select({
        product: products,
        formats: sql<string[]>`array_agg(${productFormats.format})`,
      })
      .from(products)
      .leftJoin(productFormats, eq(products.id, productFormats.productId))
      .where(whereClause)
      .groupBy(products.id);

    let mapped = results.map(({ product, formats }) => ({
      ...product,
      formats: formats || [],
    }));

    // sorting (igual que antes)
    if (filters?.sort) {
      if (filters.sort === "price_asc") mapped.sort((a, b) => a.price - b.price);
      if (filters.sort === "price_desc") mapped.sort((a, b) => b.price - a.price);
      if (filters.sort === "new") mapped.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      if (filters.sort === "bestseller") mapped.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return mapped;
  }


  async getProduct(id: number): Promise<(Product & { formats: string[] }) | undefined> {
    const [result] = await db
      .select({
        product: products,
        formats: sql<string[]>`array_agg(${productFormats.format})`,
      })
      .from(products)
      .leftJoin(productFormats, eq(products.id, productFormats.productId))
      .where(eq(products.id, id))
      .groupBy(products.id);

    if (!result) return undefined;

    return {
      ...result.product,
      formats: result.formats || [],
    };
  }

  async createProduct(insertProduct: InsertProduct & { formats?: string[] }): Promise<Product> {
    const { formats, ...productData } = insertProduct;
    const [product] = await db.insert(products).values(productData).returning();

    if (formats && formats.length > 0) {
      await db.insert(productFormats).values(formats.map((f) => ({ productId: product.id, format: f })));
    }

    return product;
  }

  async getCart(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    return items.map(({ cartItem, product }) => ({ ...cartItem, product }));
  }

  async addToCart(userId: number, item: { productId: number; quantity: number; format: string }): Promise<CartItem> {
    const fmt = (item.format || "JEF").toUpperCase();

    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, item.productId),
          eq(cartItems.format, fmt)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: (existing.quantity || 1) + (item.quantity || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    const [newItem] = await db
      .insert(cartItems)
      .values({ userId, productId: item.productId, quantity: item.quantity || 1, format: fmt })
      .returning();

    return newItem;
  }

  async removeFromCart(userId: number, id: number): Promise<void> {
    await db.delete(cartItems).where(and(eq(cartItems.id, id), eq(cartItems.userId, userId)));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
}

export const storage = new DatabaseStorage();
