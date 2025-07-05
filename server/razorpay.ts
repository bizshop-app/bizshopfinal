import Razorpay from "razorpay";
import { Request, Response } from "express";
import crypto from "crypto";
import { storage } from "./storage";
import { getPlanById } from "@shared/subscription-plans";
// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not found. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export async function createRazorpayOrder(req: Request, res: Response) {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Amount must be a positive number.",
      });
    }

    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
}

export async function verifyRazorpayPayment(req: Request, res: Response) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_details 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Payment verification successful
    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
}

export async function getSubscriptionDetails(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.razorpaySubscriptionId) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    const razorpay = getRazorpayInstance();
    const subscription = await razorpay.subscriptions.fetch(req.user.razorpaySubscriptionId);
    
    res.json({
      success: true,
      subscription: subscription,
      userPlan: req.user.subscriptionPlan,
      autoRenewal: req.user.autoRenewal
    });
  } catch (error: any) {
    console.error("Get subscription details error:", error);
    res.status(500).json({ 
      error: "Failed to get subscription details",
      details: error.message 
    });
  }
}

export async function cancelSubscription(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.razorpaySubscriptionId) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    const { cancelAtPeriodEnd = true } = req.body;
    const razorpay = getRazorpayInstance();

    const subscription = await razorpay.subscriptions.cancel(req.user.razorpaySubscriptionId, {
      cancel_at_cycle_end: cancelAtPeriodEnd ? 1 : 0
    });

    // Update user subscription status
    await storage.updateUserSubscription(req.user.id, {
      subscriptionStatus: cancelAtPeriodEnd ? "cancelled" : "inactive",
      autoRenewal: false
    });

    res.json({
      success: true,
      subscription: subscription,
      message: cancelAtPeriodEnd 
        ? "Subscription will be cancelled at the end of current billing period"
        : "Subscription cancelled immediately"
    });
  } catch (error: any) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ 
      error: "Failed to cancel subscription",
      details: error.message 
    });
  }
}

export async function pauseSubscription(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.razorpaySubscriptionId) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    const razorpay = getRazorpayInstance();
    const subscription = await razorpay.subscriptions.pause(req.user.razorpaySubscriptionId, {
      pause_at: 'now'
    });

    // Update user subscription status
    await storage.updateUserSubscription(req.user.id, {
      subscriptionStatus: "paused"
    });

    res.json({
      success: true,
      subscription: subscription,
      message: "Subscription paused successfully"
    });
  } catch (error: any) {
    console.error("Pause subscription error:", error);
    res.status(500).json({ 
      error: "Failed to pause subscription",
      details: error.message 
    });
  }
}

export async function resumeSubscription(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user.razorpaySubscriptionId) {
      return res.status(404).json({ error: "No subscription found" });
    }

    const razorpay = getRazorpayInstance();
    const subscription = await razorpay.subscriptions.resume(req.user.razorpaySubscriptionId, {
      resume_at: 'now'
    });

    // Update user subscription status
    await storage.updateUserSubscription(req.user.id, {
      subscriptionStatus: "active"
    });

    res.json({
      success: true,
      subscription: subscription,
      message: "Subscription resumed successfully"
    });
  } catch (error: any) {
    console.error("Resume subscription error:", error);
    res.status(500).json({ 
      error: "Failed to resume subscription",
      details: error.message 
    });
  }
}

export async function createSubscription(req: Request, res: Response) {
  try {
    const { plan_id, total_count = 12 } = req.body;

    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const razorpay = getRazorpayInstance();

    const subscriptionData = {
      plan_id,
      total_count,
      quantity: 1,
    };

    const subscription = await razorpay.subscriptions.create(subscriptionData);

    res.json({
      success: true,
      subscription_id: (subscription as any).id,
      status: (subscription as any).status,
      short_url: (subscription as any).short_url,
    });
  } catch (error: any) {
    console.error("Subscription creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
      error: error.message,
    });
  }
}

export async function getPaymentDetails(req: Request, res: Response) {
  try {
    const { payment_id } = req.params;

    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(payment_id);

    res.json({
      success: true,
      payment,
    });
  } catch (error: any) {
    console.error("Failed to fetch payment details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
}