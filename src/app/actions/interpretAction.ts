'use server';

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { z } from 'zod';
import { InterpretationRequestSchema, type SpreadCard, type InterpretationRequest } from '@/lib/tarot-types'; // Adjust path if needed

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to format card details for the prompt (can be reused or adapted)
const formatCardForPrompt = (spreadCard: SpreadCard): string => {
  let cardDetails = `${spreadCard.card.name}`;
  if (spreadCard.position_name) {
    cardDetails += ` (Position: ${spreadCard.position_name})`;
  }
  if (spreadCard.is_reversed) {
    cardDetails += ' (Reversed)';
  }
  cardDetails += ` - Upright: ${spreadCard.card.meaning_up} Reversed: ${spreadCard.card.meaning_rev}`;
  return cardDetails;
};

// Modified to return a plain object for debugging serialization
export async function getTarotInterpretationStream(
  requestData: InterpretationRequest
): Promise<{ interpretation?: string; error?: string; details?: any }> { // Changed return type
  try {
    const validatedRequest = InterpretationRequestSchema.parse(requestData);
    const { question, spread_name, cards } = validatedRequest;

    const systemPrompt = `You are an insightful and empathetic Tarot reader. Your interpretations should be thoughtful, nuanced, and provide guidance. Consider the traditional meanings of the Rider-Waite-Smith deck, the card's position in the spread, and whether it is upright or reversed. Synthesize these elements into a coherent narrative that addresses the user's question. Do not just list card meanings; weave them together into a flowing, readable interpretation. Use Markdown for formatting if appropriate (e.g., bolding card names).`;
    const cardDetailsString = cards.map(formatCardForPrompt).join('\n');
    const userPrompt = `
My Question: "${question}"
Spread Name: "${spread_name}"
Cards Drawn:
${cardDetailsString}

Please provide a flowing, narrative interpretation of these cards in relation to my question.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const stream = OpenAIStream(response as any); // Cast to any remains for now
    
    // Read the stream internally
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      accumulatedText += decoder.decode(value, { stream: true });
    }
    accumulatedText += decoder.decode(); // Final decode for any remaining buffer

    return { interpretation: accumulatedText }; // Return plain object

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error in Server Action:', error.errors);
      return { ...{ error: 'Invalid request data', details: error.errors } };
    }
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error in Server Action:', error.status, error.message, error.code, error.type);
      return { ...{ error: `OpenAI API Error: ${error.message}` } };
    }
    console.error('Error in getTarotInterpretationStream server action:', error);
    return { ...{ error: 'Internal Server Error' } };
  }
} 