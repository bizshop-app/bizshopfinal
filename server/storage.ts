import { 
  users, 
  User, 
  InsertUser,
  stores,
  Store,
  InsertStore,
  products,
  Product,
  InsertProduct,
  orders,
  Order,
  InsertOrder,
  categories,
  Category,
  InsertCategory,
  collections,
  Collection,
  InsertCollection,
  cartItems,
  CartItem,
  InsertCartItem,
  discountCodes,
  DiscountCode,
  InsertDiscountCode,
  productCollections,
  ProductCollection,
  InsertProductCollection,
  storeManagers,
  StoreManager,
  InsertStoreManager
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, gt } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define the storage interface with all necessary CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailVerificationToken(token: string): Promise<User | undefined>;
  getUserByPasswordResetToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getAllStores?(): Promise<Store[]>;
  updateUser(user: Partial<User> & { id: number }): Promise<User>;
  updateUserSubscription(userId: number, subscriptionData: {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    razorpayCustomerId?: string;
    razorpaySubscriptionId?: string;
    subscriptionExpiresAt?: Date;
    maxProducts?: number;
    maxStores?: number;
    autoRenewal?: boolean;
  }): Promise<User>;
  updateUserEmailVerification(id: number, verified: boolean): Promise<User>;
  updateUserPassword(id: number, hashedPassword: string): Promise<User>;
  setEmailVerificationToken(id: number, token: string): Promise<User>;
  setPasswordResetToken(id: number, token: string, expires: Date): Promise<User>;
  clearPasswordResetToken(id: number): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Store operations
  getStore(id: number): Promise<Store | undefined>;
  getStoresByUserId(userId: number): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(store: Partial<Store> & { id: number }): Promise<Store>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByStoreId(storeId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(product: Partial<Product> & { id: number }): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByStoreId(storeId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(order: Partial<Order> & { id: number }): Promise<Order>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoriesByStoreId(storeId: number): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(category: Partial<Category> & { id: number }): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Collection operations
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionsByStoreId(storeId: number): Promise<Collection[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(collection: Partial<Collection> & { id: number }): Promise<Collection>;
  deleteCollection(id: number): Promise<void>;
  
  // Cart operations
  getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(cartItem: Partial<CartItem> & { id: number }): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId?: number, sessionId?: string): Promise<void>;
  
  // Discount code operations
  getDiscountCode(id: number): Promise<DiscountCode | undefined>;
  getDiscountCodeByCode(storeId: number, code: string): Promise<DiscountCode | undefined>;
  getDiscountCodesByStoreId(storeId: number): Promise<DiscountCode[]>;
  createDiscountCode(discountCode: InsertDiscountCode): Promise<DiscountCode>;
  updateDiscountCode(discountCode: Partial<DiscountCode> & { id: number }): Promise<DiscountCode>;
  deleteDiscountCode(id: number): Promise<void>;
  
  // Product collection operations
  addProductToCollection(productId: number, collectionId: number): Promise<ProductCollection>;
  removeProductFromCollection(productId: number, collectionId: number): Promise<void>;
  getProductsByCollectionId(collectionId: number): Promise<Product[]>;
  
  // Store manager operations
  getStoreManager(id: number): Promise<StoreManager | undefined>;
  getStoreManagersByStoreId(storeId: number): Promise<StoreManager[]>;
  getStoreManagersByUserId(userId: number): Promise<StoreManager[]>;
  createStoreManager(storeManager: InsertStoreManager): Promise<StoreManager>;
  updateStoreManager(storeManager: Partial<StoreManager> & { id: number }): Promise<StoreManager>;
  deleteStoreManager(id: number): Promise<void>;
  getStoreManagerByUserAndStore(userId: number, storeId: number): Promise<StoreManager | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByEmailVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
    return user;
  }

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.passwordResetToken, token),
        gt(users.passwordResetExpires, new Date())
      )
    );
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    
    const userWithDefaults = {
      ...insertUser,
      createdAt: now,
      subscriptionPlan: "basic",
      subscriptionStatus: "trial"
    };
    
    const [user] = await db.insert(users).values(userWithDefaults).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllStores(): Promise<Store[]> {
    return await db.select().from(stores).orderBy(desc(stores.createdAt));
  }

  async updateUserSubscription(userId: number, subscriptionData: {
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    razorpayCustomerId?: string;
    razorpaySubscriptionId?: string;
    subscriptionExpiresAt?: Date;
    maxProducts?: number;
    maxStores?: number;
    autoRenewal?: boolean;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        subscriptionPlan: subscriptionData.subscriptionPlan,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        razorpayCustomerId: subscriptionData.razorpayCustomerId,
        razorpaySubscriptionId: subscriptionData.razorpaySubscriptionId,
        subscriptionExpiresAt: subscriptionData.subscriptionExpiresAt,
        maxProducts: subscriptionData.maxProducts,
        maxStores: subscriptionData.maxStores,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async updateUser(userUpdate: Partial<User> & { id: number }): Promise<User> {
    const { id, ...data } = userUpdate;
    
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return updatedUser;
  }
  
  async updateUserEmailVerification(id: number, verified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        isEmailVerified: verified, 
        emailVerificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async setEmailVerificationToken(id: number, token: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        emailVerificationToken: token,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async setPasswordResetToken(id: number, token: string, expires: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        passwordResetToken: token,
        passwordResetExpires: expires,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async clearPasswordResetToken(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    // First delete all related data
    const userStores = await this.getStoresByUserId(id);
    
    // Delete all products and orders for each store
    for (const store of userStores) {
      const storeProducts = await this.getProductsByStoreId(store.id);
      for (const product of storeProducts) {
        await this.deleteProduct(product.id);
      }
      
      const storeOrders = await this.getOrdersByStoreId(store.id);
      for (const order of storeOrders) {
        await db.delete(orders).where(eq(orders.id, order.id));
      }
      
      // Delete the store
      await db.delete(stores).where(eq(stores.id, store.id));
    }
    
    // Finally, delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  // Store methods
  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store;
  }
  
  async getStoresByUserId(userId: number): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.userId, userId));
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const now = new Date();
    
    const storeWithDefaults = {
      ...insertStore,
      createdAt: now,
      updatedAt: now,
      isPublished: false
    };
    
    const [store] = await db.insert(stores).values(storeWithDefaults).returning();
    return store;
  }
  
  async updateStore(storeUpdate: Partial<Store> & { id: number }): Promise<Store> {
    const { id, ...data } = storeUpdate;
    
    const [updatedStore] = await db
      .update(stores)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(stores.id, id))
      .returning();
    
    if (!updatedStore) {
      throw new Error(`Store with ID ${id} not found`);
    }
    
    return updatedStore;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async getProductsByStoreId(storeId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.storeId, storeId));
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const now = new Date();
    
    const productWithDefaults = {
      ...insertProduct,
      createdAt: now,
      updatedAt: now
    };
    
    const [product] = await db.insert(products).values(productWithDefaults).returning();
    return product;
  }
  
  async updateProduct(productUpdate: Partial<Product> & { id: number }): Promise<Product> {
    const { id, ...data } = productUpdate;
    
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();
    
    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  
  async getOrdersByStoreId(storeId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.storeId, storeId));
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const now = new Date();
    
    const orderWithDefaults = {
      ...insertOrder,
      createdAt: now,
      updatedAt: now
    };
    
    const [order] = await db.insert(orders).values(orderWithDefaults).returning();
    return order;
  }
  
  async updateOrder(orderUpdate: Partial<Order> & { id: number }): Promise<Order> {
    const { id, ...data } = orderUpdate;
    
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
    
    if (!updatedOrder) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    return updatedOrder;
  }

  // Category methods
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoriesByStoreId(storeId: number): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.storeId, storeId));
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const categoryWithDefaults = {
      ...insertCategory,
      createdAt: new Date()
    };
    const [category] = await db.insert(categories).values(categoryWithDefaults).returning();
    return category;
  }

  async updateCategory(categoryUpdate: Partial<Category> & { id: number }): Promise<Category> {
    const { id, ...data } = categoryUpdate;
    const [updatedCategory] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    
    if (!updatedCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Collection methods
  async getCollection(id: number): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection;
  }

  async getCollectionsByStoreId(storeId: number): Promise<Collection[]> {
    return await db.select().from(collections).where(eq(collections.storeId, storeId));
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const collectionWithDefaults = {
      ...insertCollection,
      createdAt: new Date()
    };
    const [collection] = await db.insert(collections).values(collectionWithDefaults).returning();
    return collection;
  }

  async updateCollection(collectionUpdate: Partial<Collection> & { id: number }): Promise<Collection> {
    const { id, ...data } = collectionUpdate;
    const [updatedCollection] = await db
      .update(collections)
      .set(data)
      .where(eq(collections.id, id))
      .returning();
    
    if (!updatedCollection) {
      throw new Error(`Collection with ID ${id} not found`);
    }
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<void> {
    await db.delete(collections).where(eq(collections.id, id));
  }

  // Cart methods
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItem[]> {
    if (userId) {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
    return [];
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const cartItemWithDefaults = {
      ...insertCartItem,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const [cartItem] = await db.insert(cartItems).values(cartItemWithDefaults).returning();
    return cartItem;
  }

  async updateCartItem(cartItemUpdate: Partial<CartItem> & { id: number }): Promise<CartItem> {
    const { id, ...data } = cartItemUpdate;
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(cartItems.id, id))
      .returning();
    
    if (!updatedCartItem) {
      throw new Error(`Cart item with ID ${id} not found`);
    }
    return updatedCartItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId?: number, sessionId?: string): Promise<void> {
    if (userId) {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
    } else if (sessionId) {
      await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    }
  }

  // Discount code methods
  async getDiscountCode(id: number): Promise<DiscountCode | undefined> {
    const [discountCode] = await db.select().from(discountCodes).where(eq(discountCodes.id, id));
    return discountCode;
  }

  async getDiscountCodeByCode(storeId: number, code: string): Promise<DiscountCode | undefined> {
    const [discountCode] = await db.select().from(discountCodes)
      .where(and(eq(discountCodes.storeId, storeId), eq(discountCodes.code, code)));
    return discountCode;
  }

  async getDiscountCodesByStoreId(storeId: number): Promise<DiscountCode[]> {
    return await db.select().from(discountCodes).where(eq(discountCodes.storeId, storeId));
  }

  async createDiscountCode(insertDiscountCode: InsertDiscountCode): Promise<DiscountCode> {
    const discountCodeWithDefaults = {
      ...insertDiscountCode,
      createdAt: new Date()
    };
    const [discountCode] = await db.insert(discountCodes).values(discountCodeWithDefaults).returning();
    return discountCode;
  }

  async updateDiscountCode(discountCodeUpdate: Partial<DiscountCode> & { id: number }): Promise<DiscountCode> {
    const { id, ...data } = discountCodeUpdate;
    const [updatedDiscountCode] = await db
      .update(discountCodes)
      .set(data)
      .where(eq(discountCodes.id, id))
      .returning();
    
    if (!updatedDiscountCode) {
      throw new Error(`Discount code with ID ${id} not found`);
    }
    return updatedDiscountCode;
  }

  async deleteDiscountCode(id: number): Promise<void> {
    await db.delete(discountCodes).where(eq(discountCodes.id, id));
  }

  // Product collection methods
  async addProductToCollection(productId: number, collectionId: number): Promise<ProductCollection> {
    const productCollectionData = {
      productId,
      collectionId,
      createdAt: new Date()
    };
    const [productCollection] = await db.insert(productCollections).values(productCollectionData).returning();
    return productCollection;
  }

  async removeProductFromCollection(productId: number, collectionId: number): Promise<void> {
    await db.delete(productCollections)
      .where(and(eq(productCollections.productId, productId), eq(productCollections.collectionId, collectionId)));
  }

  async getProductsByCollectionId(collectionId: number): Promise<Product[]> {
    const result = await db
      .select({ 
        id: products.id,
        storeId: products.storeId,
        categoryId: products.categoryId,
        name: products.name,
        description: products.description,
        priceInr: products.priceInr,
        compareAtPrice: products.compareAtPrice,
        imageUrl: products.imageUrl,
        tags: products.tags,
        sku: products.sku,
        inventory: products.inventory,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .innerJoin(productCollections, eq(products.id, productCollections.productId))
      .where(eq(productCollections.collectionId, collectionId));
    
    return result;
  }

  // Store manager operations
  async getStoreManager(id: number): Promise<StoreManager | undefined> {
    const result = await db.select().from(storeManagers).where(eq(storeManagers.id, id)).limit(1);
    return result[0];
  }

  async getStoreManagersByStoreId(storeId: number): Promise<StoreManager[]> {
    return await db.select().from(storeManagers).where(eq(storeManagers.storeId, storeId));
  }

  async getStoreManagersByUserId(userId: number): Promise<StoreManager[]> {
    return await db.select().from(storeManagers).where(eq(storeManagers.userId, userId));
  }

  async createStoreManager(insertStoreManager: InsertStoreManager): Promise<StoreManager> {
    const result = await db.insert(storeManagers).values(insertStoreManager).returning();
    return result[0];
  }

  async updateStoreManager(storeManagerUpdate: Partial<StoreManager> & { id: number }): Promise<StoreManager> {
    const result = await db
      .update(storeManagers)
      .set({ ...storeManagerUpdate, updatedAt: new Date() })
      .where(eq(storeManagers.id, storeManagerUpdate.id))
      .returning();
    return result[0];
  }

  async deleteStoreManager(id: number): Promise<void> {
    await db.delete(storeManagers).where(eq(storeManagers.id, id));
  }

  async getStoreManagerByUserAndStore(userId: number, storeId: number): Promise<StoreManager | undefined> {
    const result = await db
      .select()
      .from(storeManagers)
      .where(and(eq(storeManagers.userId, userId), eq(storeManagers.storeId, storeId)))
      .limit(1);
    return result[0];
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
