import crypto from 'crypto';
import type { Request, Response } from 'express';
// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

interface PaytmConfig {
  merchantId: string;
  merchantKey: string;
  website: string;
  channelId: string;
  industryType: string;
  environment: 'staging' | 'production';
}

const getPaytmConfig = (): PaytmConfig => {
  return {
    merchantId: process.env.PAYTM_MERCHANT_ID || '',
    merchantKey: process.env.PAYTM_MERCHANT_KEY || '',
    website: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
    channelId: process.env.PAYTM_CHANNEL_ID || 'WEB',
    industryType: process.env.PAYTM_INDUSTRY_TYPE || 'Retail',
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'staging') as 'staging' | 'production'
  };
};

const getPaytmURL = (environment: string) => {
  return environment === 'production' 
    ? 'https://securegw.paytm.in'
    : 'https://securegw-stage.paytm.in';
};

// Generate checksum for Paytm
const generateChecksum = (params: Record<string, string>, merchantKey: string): string => {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha256').update(paramString + merchantKey).digest('hex');
};

// Verify checksum
const verifyChecksum = (params: Record<string, string>, merchantKey: string, checksum: string): boolean => {
  const { CHECKSUMHASH, ...paramsCopy } = params;
  const generatedChecksum = generateChecksum(paramsCopy, merchantKey);
  return generatedChecksum === checksum;
};

export async function createPaytmOrder(req: Request, res: Response) {
  try {
    const { amount, orderId, customerId } = req.body;
    const config = getPaytmConfig();

    if (!config.merchantId || !config.merchantKey) {
      return res.status(500).json({ 
        error: "Paytm configuration missing. Please set PAYTM_MERCHANT_ID and PAYTM_MERCHANT_KEY" 
      });
    }

    const paytmParams: Record<string, string> = {
      MID: config.merchantId,
      WEBSITE: config.website,
      CHANNEL_ID: config.channelId,
      INDUSTRY_TYPE_ID: config.industryType,
      ORDER_ID: orderId || `ORDER_${Date.now()}`,
      CUST_ID: customerId || `CUST_${Date.now()}`,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${req.protocol}://${req.get('host')}/api/paytm/callback`,
    };

    const checksum = generateChecksum(paytmParams, config.merchantKey);
    paytmParams.CHECKSUMHASH = checksum;

    const paytmURL = getPaytmURL(config.environment);

    res.json({
      success: true,
      paytmParams,
      paytmURL: `${paytmURL}/theia/processTransaction`,
      orderId: paytmParams.ORDER_ID
    });

  } catch (error: any) {
    console.error("Paytm order creation error:", error);
    res.status(500).json({ 
      error: "Failed to create Paytm order",
      details: error.message 
    });
  }
}

export async function verifyPaytmPayment(req: Request, res: Response) {
  try {
    const config = getPaytmConfig();
    const receivedData = req.body;

    if (!config.merchantKey) {
      return res.status(500).json({ 
        error: "Paytm merchant key not configured" 
      });
    }

    const checksumhash = receivedData.CHECKSUMHASH;
    delete receivedData.CHECKSUMHASH;

    const isValidChecksum = verifyChecksum(receivedData, config.merchantKey, checksumhash);

    if (!isValidChecksum) {
      return res.status(400).json({ 
        error: "Invalid checksum" 
      });
    }

    // Verify transaction status with Paytm
    const verifyParams = {
      MID: config.merchantId,
      ORDERID: receivedData.ORDERID,
    };

    const verifyChecksum = generateChecksum(verifyParams, config.merchantKey);
    const paytmURL = getPaytmURL(config.environment);

    const verifyResponse = await fetch(`${paytmURL}/order/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...verifyParams,
        CHECKSUMHASH: verifyChecksum
      })
    });

    const verifyResult = await verifyResponse.json();

    if (verifyResult.STATUS === 'TXN_SUCCESS') {
      res.json({
        success: true,
        paymentId: receivedData.TXNID,
        orderId: receivedData.ORDERID,
        amount: receivedData.TXNAMOUNT,
        status: 'completed'
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
        status: verifyResult.STATUS
      });
    }

  } catch (error: any) {
    console.error("Paytm payment verification error:", error);
    res.status(500).json({ 
      error: "Payment verification failed",
      details: error.message 
    });
  }
}

export async function createSubscription(req: Request, res: Response) {
  try {
    const { planId, userId } = req.body;
    const config = getPaytmConfig();

    // For subscriptions, we'll create a one-time payment order
    // Paytm's subscription API is more complex and requires special merchant approval
    const orderId = `SUB_${userId}_${planId}_${Date.now()}`;
    
    // Get plan details (you'll need to import this)
    const { SUBSCRIPTION_PLANS } = await import('@shared/subscription-plans');
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(400).json({ error: "Invalid subscription plan" });
    }

    const amount = plan.priceInr;

    const paytmParams: Record<string, string> = {
      MID: config.merchantId,
      WEBSITE: config.website,
      CHANNEL_ID: config.channelId,
      INDUSTRY_TYPE_ID: config.industryType,
      ORDER_ID: orderId,
      CUST_ID: `USER_${userId}`,
      TXN_AMOUNT: amount.toString(),
      CALLBACK_URL: `${req.protocol}://${req.get('host')}/api/paytm/subscription/callback`,
    };

    const checksum = generateChecksum(paytmParams, config.merchantKey);
    paytmParams.CHECKSUMHASH = checksum;

    const paytmURL = getPaytmURL(config.environment);

    res.json({
      success: true,
      paytmParams,
      paytmURL: `${paytmURL}/theia/processTransaction`,
      orderId,
      planId,
      amount
    });

  } catch (error: any) {
    console.error("Paytm subscription creation error:", error);
    res.status(500).json({ 
      error: "Failed to create subscription",
      details: error.message 
    });
  }
}

export async function getPaymentDetails(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const config = getPaytmConfig();

    const verifyParams = {
      MID: config.merchantId,
      ORDERID: orderId,
    };

    const checksum = generateChecksum(verifyParams, config.merchantKey);
    const paytmURL = getPaytmURL(config.environment);

    const response = await fetch(`${paytmURL}/order/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...verifyParams,
        CHECKSUMHASH: checksum
      })
    });

    const result = await response.json();

    res.json({
      success: true,
      paymentDetails: result
    });

  } catch (error: any) {
    console.error("Get payment details error:", error);
    res.status(500).json({ 
      error: "Failed to fetch payment details",
      details: error.message 
    });
  }
}