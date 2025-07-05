import OpenAI from "openai";
import { Request, Response } from "express";
// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface ProductInfo {
  name?: string;
  category?: string;
  price?: number;
  features?: string[];
  tags?: string;
  description?: string;
}

export async function generateProductDescription(req: Request, res: Response) {
  try {
    if (!openai) {
      return res.status(400).json({ error: "OpenAI API key not configured" });
    }

    const { productInfo }: { productInfo: ProductInfo } = req.body;
    
    if (!productInfo.name) {
      return res.status(400).json({ error: "Product name is required" });
    }

    const prompt = `Create a compelling product description for an e-commerce store. 

Product Details:
- Name: ${productInfo.name}
- Category: ${productInfo.category || 'General'}
- Price: ${productInfo.price ? `₹${productInfo.price}` : 'Not specified'}
- Features: ${productInfo.features?.join(', ') || 'Not specified'}
- Tags: ${productInfo.tags || 'Not specified'}

Requirements:
- Write in a professional, engaging tone
- Highlight key features and benefits
- Include emotional appeal and value proposition
- Keep it between 100-200 words
- Use Indian market context where relevant
- Focus on customer benefits, not just features

Return only the description text, no additional formatting or labels.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const description = response.choices[0].message.content?.trim();
    
    res.json({ description });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate description" });
  }
}

export async function generateProductTitle(req: Request, res: Response) {
  try {
    if (!openai) {
      return res.status(400).json({ error: "OpenAI API key not configured" });
    }

    const { productInfo }: { productInfo: ProductInfo } = req.body;
    
    const prompt = `Generate 5 compelling product titles for an e-commerce product.

Product Details:
- Current Name: ${productInfo.name || 'Product'}
- Category: ${productInfo.category || 'General'}
- Features: ${productInfo.features?.join(', ') || 'Not specified'}
- Tags: ${productInfo.tags || 'Not specified'}

Requirements:
- Titles should be SEO-friendly and appealing
- Include key features or benefits
- Keep under 60 characters each
- Make them sound professional and trustworthy
- Suitable for Indian e-commerce market

Return as JSON array with format: {"titles": ["title1", "title2", "title3", "title4", "title5"]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    res.json(result);
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate titles" });
  }
}

export async function generateStoreBanner(req: Request, res: Response) {
  try {
    if (!openai) {
      return res.status(400).json({ error: "OpenAI API key not configured" });
    }

    const { storeInfo }: { storeInfo: { name: string; category?: string; description?: string } } = req.body;
    
    if (!storeInfo.name) {
      return res.status(400).json({ error: "Store name is required" });
    }

    const prompt = `Create compelling banner content for an online store.

Store Details:
- Name: ${storeInfo.name}
- Category: ${storeInfo.category || 'General'}
- Description: ${storeInfo.description || 'Not specified'}

Generate:
1. A catchy headline (under 50 characters)
2. A compelling subheadline (under 100 characters)
3. A call-to-action button text (under 20 characters)

Make it appealing for Indian customers, professional, and conversion-focused.

Return as JSON: {"headline": "text", "subheadline": "text", "cta": "text"}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    res.json(result);
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate banner content" });
  }
}

export async function generateProductTags(req: Request, res: Response) {
  try {
    if (!openai) {
      return res.status(400).json({ error: "OpenAI API key not configured" });
    }

    const { productInfo }: { productInfo: ProductInfo } = req.body;
    
    const prompt = `Generate relevant tags for this e-commerce product.

Product Details:
- Name: ${productInfo.name || 'Product'}
- Category: ${productInfo.category || 'General'}
- Description: ${productInfo.description || 'Not specified'}

Requirements:
- Generate 8-12 relevant tags
- Include category, features, use cases, and target audience tags
- Make them SEO-friendly and searchable
- Use single words or short phrases
- Relevant for Indian market

Return as JSON: {"tags": ["tag1", "tag2", "tag3", ...]}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.6,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    res.json(result);
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to generate tags" });
  }
}