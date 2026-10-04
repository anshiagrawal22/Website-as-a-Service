import { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AppError } from '../middlewares/errorHandler.js';

export async function generateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { prompt, businessName, category, type } = req.body;

    if (!businessName && !prompt) {
      throw new AppError('Business name or prompt is required for AI generation.', 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are a high-end luxury branding and copywriting expert for the Verdant Website as a Service platform.
Generate a concise, elegant, boutique-quality text output based on the following instructions.
Keep your response polished, professional, and ready to use immediately without markdown formatting, quotes, or conversational filler.`;

        let userPrompt = prompt;
        if (!userPrompt) {
          if (type === 'headline') {
            userPrompt = `Write an inspiring, punchy, elegant hero headline (under 8 words) for a ${category || 'boutique'} business named "${businessName}".`;
          } else if (type === 'description') {
            userPrompt = `Write a compelling 2-sentence brand description for a ${category || 'boutique'} business named "${businessName}". Emphasize craftsmanship, authenticity, and refined aesthetics.`;
          } else {
            userPrompt = `Write marketing copy for ${businessName} (${category || 'boutique'}).`;
          }
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nTask: ${userPrompt}`,
        });

        const generatedText = response.text ? response.text.trim() : '';
        if (generatedText) {
          res.status(200).json({
            success: true,
            result: generatedText,
            source: 'gemini',
          });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using intelligent editorial template fallback:', geminiError?.message || geminiError);
      }
    }

    // High-quality editorial fallbacks if no API key is set or quota exceeded
    let fallbackText = '';
    const safeCat = (category || 'boutique').toLowerCase();

    if (type === 'headline') {
      if (safeCat.includes('fashion') || safeCat.includes('clothing')) {
        fallbackText = 'Redefining Modern Elegance in Pure Linen';
      } else if (safeCat.includes('beauty') || safeCat.includes('cosmetic')) {
        fallbackText = 'Organic Botanicals Engineered for Radiant Skin';
      } else if (safeCat.includes('home') || safeCat.includes('ceramic')) {
        fallbackText = 'Wabi-sabi Objects Handcrafted for Mindful Living';
      } else if (safeCat.includes('bakery') || safeCat.includes('cafe')) {
        fallbackText = 'Artisanal Sourdough & Hearth-Baked Morning Pastries';
      } else {
        fallbackText = 'Thoughtfully Crafted Essentials for Discerning Living';
      }
    } else {
      if (safeCat.includes('fashion') || safeCat.includes('clothing')) {
        fallbackText = 'Effortless silhouettes crafted in pure linen & botanical silks, designed for timeless comfort and understated beauty.';
      } else if (safeCat.includes('beauty') || safeCat.includes('cosmetic')) {
        fallbackText = 'Pure cold-pressed botanical oils, active plant remedies, and minimalist mineral treatments formulated for sensitive skin.';
      } else if (safeCat.includes('home') || safeCat.includes('ceramic')) {
        fallbackText = 'Hand-thrown stoneware, quiet contemplation, and architectural ceramic objects created for serene modern living spaces.';
      } else if (safeCat.includes('bakery') || safeCat.includes('cafe')) {
        fallbackText = 'Slow-fermented sourdoughs and viennoiserie baked fresh daily in a hearthstone wood-fired oven.';
      } else {
        fallbackText = `Welcome to our official website! Dedicated to providing exceptional quality, timeless design, and mindful service for ${businessName}.`;
      }
    }

    res.status(200).json({
      success: true,
      result: fallbackText,
      source: 'editorial-preset',
    });
  } catch (err) {
    next(err);
  }
}
