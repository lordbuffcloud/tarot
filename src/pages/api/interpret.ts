import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { ZodError } from 'zod';
import { InterpretationRequestSchema, type SpreadCard } from '@/lib/tarot-types'; // Adjust path if needed

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to format card details for the prompt
const formatCardForPrompt = (spreadCard: SpreadCard): string => {
  let cardDetails = `${spreadCard.card.name}`;
  if (spreadCard.position_name) {
    cardDetails += ` (Position: ${spreadCard.position_name})`;
  }
  if (spreadCard.is_reversed) {
    cardDetails += ' (Reversed)';
  }
  // Include basic meanings to guide the AI, but it will also use its own knowledge
  cardDetails += ` - Upright: ${spreadCard.card.meaning_up} Reversed: ${spreadCard.card.meaning_rev}`;
  return cardDetails;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Validate request body
    const validatedRequest = InterpretationRequestSchema.parse(req.body);
    const { question, spread_name, cards } = validatedRequest;

    const systemPrompt = `You are an insightful and empathetic Tarot reader. Your interpretations should be thoughtful, nuanced, and provide guidance. Consider the traditional meanings of the Rider-Waite-Smith deck, the card's position in the spread, and whether it is upright or reversed. Synthesize these elements into a coherent narrative that addresses the user's question. Do not just list card meanings; weave them together.`;

    const cardDetailsString = cards.map(formatCardForPrompt).join('\n');

    const userPrompt = `
      My Question: "${question}"
      Spread Name: "${spread_name}"
      Cards Drawn:
      ${cardDetailsString}

      Please provide an interpretation of these cards in relation to my question.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7, // Adjust for creativity vs. determinism
      // max_tokens: 500, // Optional: to limit response length
    });

    const interpretation = chatCompletion.choices[0]?.message?.content;

    if (!interpretation) {
      return res.status(500).json({ error: 'Failed to get interpretation from AI.' });
    }

    return res.status(200).json({ interpretation });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid request body', details: error.errors });
    }
    if (error instanceof OpenAI.APIError) {
        console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
        return res.status(error.status || 500).json({ error: `OpenAI API Error: ${error.message}` });
    }
    console.error('Error in /api/interpret:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 