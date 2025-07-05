import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendEmail, generateVerificationEmail, generatePasswordResetEmail, generateOrderConfirmationEmail } from "./email";
import { 
  generalLimiter, 
  authLimiter, 
  passwordResetLimiter, 
  fileUploadLimiter,
  securityMiddleware,
  corsMiddleware,
  sanitizeInput,
  validateFileUpload,
  requireEmailVerification,
  requireAdmin,
  errorHandler
} from "./middleware";
import crypto from "crypto";
import validator from 'validator';
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import { 
  insertStoreSchema, 
  insertProductSchema, 
  insertOrderSchema,
  insertCategorySchema,
  insertCollectionSchema,
  insertCartItemSchema,
  insertDiscountCodeSchema,
  insertStoreManagerSchema
} from "@shared/schema";
import { SUBSCRIPTION_PLANS, getPlanById } from "@shared/subscription-plans";
import { 
  createPaytmOrder, 
  verifyPaytmPayment, 
  createSubscription as createPaytmSubscription, 
  getPaymentDetails as getPaytmPaymentDetails 
} from "./paytm";
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  createSubscription, 
  getPaymentDetails as getRazorpayPaymentDetails,
  getSubscriptionDetails,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription
} from "./razorpay";
import { generateProductDescription, generateProductTitle, generateStoreBanner, generateProductTags } from "./ai-content";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import multer from "multer";
import { join, extname } from "path";
import { promises as fs } from "fs";
// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

const scryptAsync = promisify(scrypt);

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Configure multer for file uploads
const uploadDir = join(process.cwd(), 'uploads');

// Ensure upload directory exists
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error('Only image files are allowed!');
      cb(error as any, false);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware (conditionally in development)
  if (process.env.NODE_ENV === 'production') {
    app.use(securityMiddleware);
  }
  app.use(corsMiddleware);
  app.use(sanitizeInput);
  app.use(generalLimiter);

  // Set up authentication routes
  setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }, express.static(uploadDir));

  // File upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size 
      });
    } catch (error) {
      res.status(500).json({ error: 'File upload failed' });
    }
  });

  // Email verification route
  app.get("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      const user = await storage.getUserByEmailVerificationToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      await storage.updateUserEmailVerification(user.id, true);
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset request
  app.post("/api/forgot-password", passwordResetLimiter, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If the email exists, a reset link has been sent" });
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await storage.setPasswordResetToken(user.id, resetToken, resetExpires);
      const resetEmail = generatePasswordResetEmail(user.username, resetToken, req.protocol + '://' + req.get('host'));
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html: resetEmail
      });
      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset confirmation
  app.post("/api/reset-password", passwordResetLimiter, async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const user = await storage.getUserByPasswordResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const hashedPassword = await hashPassword(password);
      await storage.updateUserPassword(user.id, hashedPassword);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset confirmation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: (req.user as any)?.id || 'guest'
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Admin routes - super admin only
  app.get("/api/admin/stats", requireAuth, async (req, res) => {
    try {
      // Only allow super admin (user ID 1)
      const user = req.user as any;
      if (!user.isAdmin || user.id !== 1) {
        return res.status(403).json({ error: "Access denied. Super admin only." });
      }
      
      const [users, stores] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllStores()
      ]);

      // Calculate subscription revenue
      const monthlyRevenue = users
        .filter((u: any) => u.subscriptionStatus === 'active')
        .reduce((total, user: any) => {
          const plans: Record<string, number> = { 
            basic_monthly: 199, 
            advanced_monthly: 299, 
            basic_yearly: 999/12, // Convert yearly to monthly
            advanced_yearly: 2499/12 
          };
          return total + (plans[user.subscriptionPlan] || 0);
        }, 0);

      const stats = {
        totalUsers: users.length,
        totalStores: stores.length,
        totalProducts: 0, // Will be calculated from all stores
        totalOrders: 0, // Will be calculated from all stores
        activeSubscriptions: users.filter((u: any) => u.subscriptionStatus === 'active').length,
        monthlyRevenue: Math.round(monthlyRevenue),
        totalRevenue: Math.round(monthlyRevenue * 12), // Estimated annual revenue
        pendingEmailVerifications: users.filter((u: any) => !u.isEmailVerified).length
      };

      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/admin/users", requireAuth, async (req, res) => {
    try {
      // Only allow super admin (user ID 1)
      const user = req.user as any;
      if (!user.isAdmin || user.id !== 1) {
        return res.status(403).json({ error: "Access denied. Super admin only." });
      }
      
      const users = await storage.getAllUsers();
      
      // Include subscription details in response
      const usersWithDetails = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        maxProducts: user.maxProducts,
        maxStores: user.maxStores,
        isEmailVerified: user.isEmailVerified,
        isActive: user.isActive,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }));
      
      res.json(usersWithDetails);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:userId", requireAuth, async (req, res) => {
    try {
      // Only allow super admin (user ID 1)
      const user = req.user as any;
      if (!user.isAdmin || user.id !== 1) {
        return res.status(403).json({ error: "Access denied. Super admin only." });
      }
      
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      
      // Prevent modifying your own admin status
      if (userId === user.id && 'isAdmin' in updates) {
        return res.status(400).json({ error: "Cannot modify your own admin status" });
      }
      
      const updatedUser = await storage.updateUser({ id: userId, ...updates });
      res.json(updatedUser);
    } catch (error) {
      console.error("Admin user update error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Demo data seeding endpoint
  app.post("/api/seed-demo", async (req, res, next) => {
    try {
      // Create demo user
      const demoUser = await storage.createUser({
        username: "demo",
        password: await hashPassword("password123"),
        email: "demo@bizshop.com",
        fullName: "Demo User",
        subscriptionPlan: "professional",
        subscriptionStatus: "active"
      });

      // Create demo store
      const demoStore = await storage.createStore({
        userId: demoUser.id,
        name: "Fashion Boutique",
        description: "Premium fashion and accessories for modern lifestyle",
        template: "boutique",
        logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center",
        primaryColor: "#3563E9",
        accentColor: "#F97316",
        fontFamily: "Inter",
        isPublished: true
      });

      // Create demo products
      const demoProducts = [
        {
          storeId: demoStore.id,
          name: "Designer Dress",
          description: "Elegant evening dress perfect for special occasions",
          priceInr: 2999,
          imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
          inventory: 15,
          isActive: true
        },
        {
          storeId: demoStore.id,
          name: "Leather Handbag",
          description: "Premium leather handbag with modern design",
          priceInr: 1599,
          imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
          inventory: 8,
          isActive: true
        },
        {
          storeId: demoStore.id,
          name: "Designer Watch",
          description: "Luxury timepiece with premium materials",
          priceInr: 4999,
          imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
          inventory: 8,
          isActive: true
        },
        {
          storeId: demoStore.id,
          name: "Casual Sneakers",
          description: "Comfortable sneakers for everyday wear",
          priceInr: 1999,
          imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
          inventory: 25,
          isActive: true
        }
      ];

      for (const product of demoProducts) {
        await storage.createProduct(product);
      }

      // Create demo orders
      await storage.createOrder({
        storeId: demoStore.id,
        customerName: "John Smith",
        customerEmail: "john@example.com",
        customerPhone: "+91 9876543210",
        totalAmount: 7998,
        items: [
          { productId: 1, name: "Designer Dress", price: 2999, quantity: 1 },
          { productId: 2, name: "Leather Handbag", price: 4999, quantity: 1 }
        ],
        status: "completed",
        paymentId: "demo_payment_123",
        shippingAddress: "123 Main Street, Mumbai, Maharashtra 400001"
      });

      await storage.createOrder({
        storeId: demoStore.id,
        customerName: "Sarah Johnson",
        customerEmail: "sarah@example.com",
        customerPhone: "+91 9876543211",
        totalAmount: 4999,
        items: [
          { productId: 2, name: "Leather Handbag", price: 4999, quantity: 1 }
        ],
        status: "processing",
        paymentId: "demo_payment_124",
        shippingAddress: "456 Park Avenue, Delhi, Delhi 110001"
      });

      // Create admin user
      await storage.createUser({
        username: "admin",
        password: await hashPassword("admin123"),
        email: "admin@bizshop.com",
        fullName: "Admin User",
        isAdmin: true,
        subscriptionPlan: "enterprise",
        subscriptionStatus: "active"
      });

      res.json({ 
        message: "Demo data created successfully",
        credentials: {
          demo: { username: "demo", password: "password123" },
          admin: { username: "admin", password: "admin123" }
        }
      });
    } catch (error) {
      console.error("Demo seeding error:", error);
      res.status(500).json({ error: "Demo data already exists or creation failed" });
    }
  });

  // User API route
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      res.json(user);
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Store API routes
  app.get("/api/stores", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const userId = req.user!.id;
      const stores = await storage.getStoresByUserId(userId);
      res.json(stores);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/stores/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      if (store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      res.json(store);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const userId = req.user!.id;
      const storeData = insertStoreSchema.parse({
        ...req.body,
        userId
      });
      
      const store = await storage.createStore(storeData);
      res.status(201).json(store);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/stores/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      if (store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const storeData = { ...req.body, id: storeId };
      const updatedStore = await storage.updateStore(storeData);
      res.json(updatedStore);
    } catch (error) {
      next(error);
    }
  });

  // Product API routes
  app.get("/api/stores/:storeId/products", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      if (store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const products = await storage.getProductsByStoreId(storeId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores/:storeId/products", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      if (store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const productData = insertProductSchema.parse({
        ...req.body,
        storeId
      });
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).send("Product not found");
      }
      
      const store = await storage.getStore(product.storeId);
      
      if (store?.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const productData = { ...req.body, id: productId };
      const updatedProduct = await storage.updateProduct(productData);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/products/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).send("Product not found");
      }
      
      const store = await storage.getStore(product.storeId);
      
      if (store?.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      await storage.deleteProduct(productId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Order API routes
  app.get("/api/stores/:storeId/orders", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      if (store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const orders = await storage.getOrdersByStoreId(storeId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/orders/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).send("Order not found");
      }
      
      const store = await storage.getStore(order.storeId);
      
      if (store?.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }
      
      const orderData = { ...req.body, id: orderId };
      const updatedOrder = await storage.updateOrder(orderData);
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  });

  // Admin API routes
  app.get("/api/admin/users", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      // Check if user is admin
      if (!req.user!.isAdmin) {
        return res.status(403).send("Forbidden: Admin access required");
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/users/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      // Check if user is admin
      if (!req.user!.isAdmin) {
        return res.status(403).send("Forbidden: Admin access required");
      }
      
      const userId = parseInt(req.params.id);
      const { isAdmin } = req.body;
      
      // Validate input
      if (typeof isAdmin !== 'boolean') {
        return res.status(400).send("Invalid request body");
      }
      
      const updatedUser = await storage.updateUser({ id: userId, isAdmin });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/users/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }
      
      // Check if user is admin
      if (!req.user!.isAdmin) {
        return res.status(403).send("Forbidden: Admin access required");
      }
      
      const userId = parseInt(req.params.id);
      
      // Don't allow deleting yourself
      if (userId === req.user!.id) {
        return res.status(400).send("Cannot delete your own account");
      }
      
      await storage.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Public storefront API routes (no authentication required)
  app.get("/api/public/stores/:id", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      res.json(store);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/public/stores/:id/products", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      const products = await storage.getProductsByStoreId(storeId);
      res.json(products.filter(p => p.isActive));
    } catch (error) {
      next(error);
    }
  });

  // Get store owner subscription details for public store
  app.get("/api/stores/:id/owner", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      const owner = await storage.getUser(store.userId);
      
      if (!owner) {
        return res.status(404).send("Store owner not found");
      }
      
      // Only return subscription plan info for branding purposes
      res.json({
        subscriptionPlan: owner.subscriptionPlan
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/public/stores/:id/products", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store || !store.isPublished) {
        return res.status(404).send("Store not found or not published");
      }
      
      const products = await storage.getProductsByStoreId(storeId);
      const activeProducts = products.filter(product => product.isActive);
      res.json(activeProducts);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/public/stores/:id/orders", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store) {
        return res.status(404).send("Store not found");
      }
      
      // Get store owner to determine transaction fee
      const storeOwner = await storage.getUser(store.userId);
      if (!storeOwner) {
        return res.status(404).send("Store owner not found");
      }
      
      const { calculateTransactionFee, calculateMerchantPayout } = await import("@shared/transaction-fees");
      const transactionFee = calculateTransactionFee(req.body.total, storeOwner.subscriptionPlan || "free");
      const merchantPayout = calculateMerchantPayout(req.body.total, storeOwner.subscriptionPlan || "free");
      
      const orderData = insertOrderSchema.parse({
        ...req.body,
        storeId,
        status: "pending",
        transactionFee,
        merchantPayout
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  });

  // Category API routes
  app.get("/api/stores/:storeId/categories", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const categories = await storage.getCategoriesByStoreId(storeId);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores/:storeId/categories", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const categoryData = insertCategorySchema.parse({
        ...req.body,
        storeId
      });

      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/stores/:storeId/categories/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const categoryId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const category = await storage.updateCategory({
        id: categoryId,
        ...req.body
      });
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/stores/:storeId/categories/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const categoryId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      await storage.deleteCategory(categoryId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Collection API routes
  app.get("/api/stores/:storeId/collections", async (req, res, next) => {
    try {
      const storeId = parseInt(req.params.storeId);
      const collections = await storage.getCollectionsByStoreId(storeId);
      res.json(collections);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores/:storeId/collections", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const collectionData = insertCollectionSchema.parse({
        ...req.body,
        storeId
      });

      const collection = await storage.createCollection(collectionData);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  });

  // Shopping cart API routes
  app.get("/api/cart", async (req, res, next) => {
    try {
      const userId = req.isAuthenticated() ? req.user!.id : undefined;
      const sessionId = req.sessionID;
      
      const cartItems = await storage.getCartItems(userId, sessionId);
      res.json(cartItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart", async (req, res, next) => {
    try {
      const userId = req.isAuthenticated() ? req.user!.id : undefined;
      const sessionId = req.sessionID;

      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
        sessionId: userId ? undefined : sessionId
      });

      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/cart/:id", async (req, res, next) => {
    try {
      const cartItemId = parseInt(req.params.id);
      const cartItem = await storage.updateCartItem({
        id: cartItemId,
        ...req.body
      });
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/:id", async (req, res, next) => {
    try {
      const cartItemId = parseInt(req.params.id);
      await storage.removeFromCart(cartItemId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Discount code API routes
  app.get("/api/stores/:storeId/discount-codes", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const discountCodes = await storage.getDiscountCodesByStoreId(storeId);
      res.json(discountCodes);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores/:storeId/discount-codes", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const discountCodeData = insertDiscountCodeSchema.parse({
        ...req.body,
        storeId,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
        startsAt: req.body.startsAt ? new Date(req.body.startsAt) : null
      });

      const discountCode = await storage.createDiscountCode(discountCodeData);
      res.json(discountCode);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/stores/:storeId/discount-codes/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const discountId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const discountCode = await storage.updateDiscountCode({
        id: discountId,
        ...req.body
      });
      res.json(discountCode);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/stores/:storeId/discount-codes/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const discountId = parseInt(req.params.id);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      await storage.deleteDiscountCode(discountId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/discount-codes/validate", async (req, res, next) => {
    try {
      const { storeId, code } = req.body;
      
      const discountCode = await storage.getDiscountCodeByCode(storeId, code);
      
      if (!discountCode || !discountCode.isActive) {
        return res.status(404).json({ error: "Invalid discount code" });
      }

      // Check if code is expired
      if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
        return res.status(400).json({ error: "Discount code has expired" });
      }

      // Check usage limit
      if (discountCode.usageLimit && (discountCode.usageCount || 0) >= discountCode.usageLimit) {
        return res.status(400).json({ error: "Discount code usage limit reached" });
      }

      res.json(discountCode);
    } catch (error) {
      next(error);
    }
  });

  // Subscription management routes
  app.get("/api/subscription/plans", async (req, res) => {
    const { SUBSCRIPTION_PLANS } = await import("@shared/subscription-plans");
    res.json(SUBSCRIPTION_PLANS);
  });

  // Early bird offer stats
  app.get("/api/early-bird/stats", async (req, res) => {
    try {
      const earlyBirdUsers = await storage.getAllUsers();
      const earlyBirdCount = earlyBirdUsers.filter(user => user.isEarlyBirdUser).length;
      const spotsRemaining = Math.max(0, 250 - earlyBirdCount);
      
      res.json({
        totalSpots: 250,
        spotsTaken: earlyBirdCount,
        spotsRemaining,
        isActive: spotsRemaining > 0
      });
    } catch (error) {
      console.error("Error fetching early bird stats:", error);
      res.status(500).json({ error: "Failed to fetch early bird stats" });
    }
  });

  app.post("/api/subscription/create", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const { planId } = req.body;
      const userId = req.user.id;
      
      const { getPlanById } = await import("@shared/subscription-plans");
      const plan = getPlanById(planId);
      
      if (!plan) {
        return res.status(400).json({ error: "Invalid subscription plan" });
      }

      if (plan.priceInr === 0) {
        // Free plan - update user directly
        const updatedUser = await storage.updateUserSubscription(userId, {
          subscriptionPlan: plan.id,
          subscriptionStatus: "active",
          maxProducts: plan.maxProducts,
          maxStores: plan.maxStores,
          subscriptionExpiresAt: undefined
        });
        return res.json({ success: true, user: updatedUser });
      }

      // Create Razorpay order for paid plans
      const orderResponse = await createRazorpayOrder(req, res);
      return orderResponse;
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/subscription/verify-payment", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
      const userId = req.user.id;

      // Verify payment first
      const verifyResponse = await verifyPaytmPayment(req, res);
      
      if (verifyResponse) {
        const { getPlanById } = await import("@shared/subscription-plans");
        const plan = getPlanById(planId);
        
        if (plan) {
          // Calculate expiration date (30 days from now)
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);

          const updatedUser = await storage.updateUser({ 
            id: userId,
            subscriptionPlan: plan.id,
            subscriptionStatus: "active",
            maxProducts: plan.maxProducts,
            maxStores: plan.maxStores,
            subscriptionExpiresAt: expiresAt
          });

          res.json({ 
            success: true, 
            user: updatedUser,
            message: "Subscription activated successfully!"
          });
        }
      }
    } catch (error) {
      next(error);
    }
  });



  // Get templates
  app.get("/api/templates", (req, res) => {
    const templates = [
      {
        id: "boutique",
        name: "Boutique",
        description: "Perfect for fashion, accessories, and specialty stores.",
        imageUrl: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d",
        category: "fashion"
      },
      {
        id: "artisan",
        name: "Artisan",
        description: "Ideal for handcrafted goods, art, and unique products.",
        imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
        category: "handmade"
      },
      {
        id: "tech",
        name: "Tech",
        description: "Designed for electronics, gadgets, and digital products.",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c",
        category: "electronics"
      }
    ];
    
    res.json(templates);
  });

  // Store manager routes
  app.get("/api/stores/:storeId/managers", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const managers = await storage.getStoreManagersByStoreId(storeId);
      
      // Fetch user details for each manager
      const managersWithUsers = await Promise.all(
        managers.map(async (manager) => {
          const user = await storage.getUser(manager.userId);
          return {
            ...manager,
            user: user ? {
              username: user.username,
              email: user.email,
              fullName: user.fullName
            } : null
          };
        })
      );

      res.json(managersWithUsers);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/stores/:storeId/managers/invite", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const { email, permissions } = req.body;
      
      // Check if user exists
      const invitedUser = await storage.getUserByEmail(email);
      if (!invitedUser) {
        return res.status(404).json({ error: "User not found. They need to create an account first." });
      }

      // Check if already a manager
      const existingManager = await storage.getStoreManagerByUserAndStore(invitedUser.id, storeId);
      if (existingManager) {
        return res.status(400).json({ error: "User is already a manager of this store" });
      }

      // Check manager limit
      const existingManagers = await storage.getStoreManagersByStoreId(storeId);
      if (existingManagers.length >= 3) {
        return res.status(400).json({ error: "Maximum number of managers (3) reached" });
      }

      const managerData = insertStoreManagerSchema.parse({
        storeId,
        userId: invitedUser.id,
        permissions,
        invitedBy: req.user!.id,
        status: "pending"
      });

      const manager = await storage.createStoreManager(managerData);
      
      // TODO: Send email invitation
      
      res.json(manager);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/stores/:storeId/managers/:managerId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const managerId = parseInt(req.params.managerId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      const manager = await storage.updateStoreManager({
        id: managerId,
        ...req.body
      });

      res.json(manager);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/stores/:storeId/managers/:managerId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Unauthorized");
      }

      const storeId = parseInt(req.params.storeId);
      const managerId = parseInt(req.params.managerId);
      const store = await storage.getStore(storeId);
      
      if (!store || store.userId !== req.user!.id) {
        return res.status(403).send("Forbidden");
      }

      await storage.deleteStoreManager(managerId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Orders API route
  app.post("/api/orders", async (req, res, next) => {
    try {
      const {
        storeId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items,
        total,
        paymentId,
        orderId,
        signature
      } = req.body;

      // Validate required fields
      if (!storeId || !customerName || !customerEmail || !shippingAddress || !items || !total) {
        return res.status(400).json({ 
          error: "Missing required fields: storeId, customerName, customerEmail, shippingAddress, items, total" 
        });
      }

      // Get store and owner info for transaction fee calculation
      const store = await storage.getStore(storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }

      const storeOwner = await storage.getUser(store.userId);
      if (!storeOwner) {
        return res.status(404).json({ error: "Store owner not found" });
      }

      // Calculate transaction fees
      const { calculateTransactionFee, calculateMerchantPayout } = await import("@shared/transaction-fees");
      const transactionFee = calculateTransactionFee(total, storeOwner.subscriptionPlan || "free");
      const merchantPayout = calculateMerchantPayout(total, storeOwner.subscriptionPlan || "free");

      // Create order data
      const orderData = {
        storeId: parseInt(storeId),
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items: typeof items === 'string' ? JSON.parse(items) : items,
        total: parseFloat(total),
        transactionFee,
        merchantPayout,
        status: paymentId ? "confirmed" : "pending",
        paymentStatus: paymentId ? "paid" : "pending",
        notes: paymentId ? `Razorpay Payment ID: ${paymentId}, Order ID: ${orderId}` : null
      };

      // Save order to database
      const order = await storage.createOrder(orderData);

      res.status(201).json({
        success: true,
        order,
        transactionFee,
        merchantPayout,
        message: "Order created successfully"
      });

    } catch (error) {
      console.error("Error creating order:", error);
      next(error);
    }
  });

  // Razorpay API routes  
  app.post("/api/razorpay/orders", createRazorpayOrder);
  app.post("/api/razorpay/verify", verifyRazorpayPayment);
  app.post("/api/razorpay/subscriptions", createSubscription);
  app.get("/api/razorpay/subscriptions/:id", getSubscriptionDetails);
  app.post("/api/razorpay/subscriptions/:id/cancel", cancelSubscription);
  app.post("/api/razorpay/subscriptions/:id/pause", pauseSubscription);
  app.post("/api/razorpay/subscriptions/:id/resume", resumeSubscription);
  app.get("/api/razorpay/payments/:id", getRazorpayPaymentDetails);

  // Subscription management for users
  app.post("/api/create-user-subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { planId } = req.body;
      
      const subscriptionData = {
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 12,
        notes: {
          userId: user.id,
          email: user.email
        }
      };

      // Call internal Razorpay function
      const subscription = await createSubscription(
        { body: subscriptionData } as any,
        { json: (data: any) => data } as any
      );
      
      await storage.updateUserSubscription(user.id, {
        subscriptionPlan: planId,
        subscriptionStatus: "active",
        razorpaySubscriptionId: subscription.id,
        autoRenewal: true
      });

      res.json(subscription);
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Update subscription preferences
  app.patch("/api/user/subscription", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { autoRenewal } = req.body;
      
      const updatedUser = await storage.updateUserSubscription(user.id, {
        autoRenewal
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Subscription update error:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });

  // Order notification endpoint
  app.post("/api/send-order-notification", async (req, res) => {
    try {
      const { storeOwnerEmail, orderDetails } = req.body;
      
      // Send email notification using SendGrid if available
      if (process.env.SENDGRID_API_KEY) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: storeOwnerEmail,
          from: 'noreply@bizshop.com',
          subject: `New Order Received - Order #${orderDetails.id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3563E9;">New Order Notification</h2>
              <p>You have received a new order on your BizShop store!</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> #${orderDetails.id}</p>
                <p><strong>Customer:</strong> ${orderDetails.customerName}</p>
                <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount.toLocaleString()}</p>
                
                <h4>Items Ordered:</h4>
                <ul>
                  ${orderDetails.items.map(item => 
                    `<li>${item.productName} x ${item.quantity} - ₹${item.price.toLocaleString()}</li>`
                  ).join('')}
                </ul>
              </div>
              
              <p>Please log in to your BizShop dashboard to process this order.</p>
              <p>Best regards,<br>BizShop Team</p>
            </div>
          `
        };

        await sgMail.send(msg);
      }
      
      res.json({ success: true, message: "Notification sent successfully" });
    } catch (error) {
      console.error("Order notification error:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // AI Content Generation Routes
  app.post("/api/ai/generate-product-description", generateProductDescription);
  app.post("/api/ai/generate-description", generateProductDescription);
  app.post("/api/ai/generate-title", generateProductTitle);
  app.post("/api/ai/generate-banner", generateStoreBanner);
  app.post("/api/ai/generate-tags", generateProductTags);

  // Error handling middleware (should be last)
  app.use(errorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
