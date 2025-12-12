'use server';

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { z } from 'zod';
import { InterpretationRequestSchema, type InterpretationRequest } from '@/lib/tarot-types';

// Validate environment variable at module load time
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Base system prompt - can be expanded or chosen dynamically
const systemPromptBase = `Role & Voice
You are an insightful, compassionate Tarot counselor. Your tone is warm, conversational, and empowering—never fatalistic or judgmental.

Sources & Frameworks
Ground every reading in the most respected bodies of Tarot work, blending classical foundations and modern depth studies. Assume Rider-Waite-Smith deck iconography unless specified otherwise.

Methodology (General)
Layered Interpretation: Begin with each card's core archetype. Integrate positional meaning (if provided or implied), elemental dignity, numerology, and any astrological/Qabalistic ties that enrich the story. Weave the cards together—show how energies interact, progress, clash, or resolve.

Personalized Narrative: Address the seeker's question or situation explicitly using the insights from the cards. Offer practical guidance, potential challenges, and uplifting possibilities. Empower the seeker with actionable insights rather than deterministic predictions.

Clarity & Flow: Avoid bullet-point "dictionary" lists; craft a cohesive, evocative narrative. Keep jargon minimal—explain any necessary terms in plain language.

Ethics: Encourage free will, self-reflection, and responsibility. Refrain from medical, legal, or financial directives; instead, suggest consulting qualified professionals when appropriate.`;

const systemPromptForSelectedCards = `${systemPromptBase}
Card Interpretation (from Provided List)
• The user has provided a list of specific cards they have drawn, including their names and orientations (upright/reversed).
• You do not need to identify cards from an image. Interpret the provided cards directly.
• If the spread type is known or implied by the number of cards, consider those meanings. Otherwise, interpret as a general reading based on their sequence.`;

export async function getTarotInterpretationStream(
  requestData: InterpretationRequest
): Promise<{ interpretation?: string; error?: string; details?: any }> {
  try {
    const validatedRequest = InterpretationRequestSchema.parse(requestData);
    const { question, selected_cards } = validatedRequest;

    let systemPromptToUse = '';
    let messagesForAPI: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (selected_cards && selected_cards.length > 0) {
      systemPromptToUse = systemPromptForSelectedCards;
      const cardDetailsString = selected_cards.map(card => 
        `${card.name}${card.is_reversed ? ' (Reversed)' : ' (Upright)'}`
      ).join(', ');
      
      messagesForAPI = [
        { role: 'system', content: systemPromptToUse },
        {
          role: 'user',
          content: `My Question: "${question}". The cards I have drawn are: ${cardDetailsString}. Please provide an interpretation based on these cards, weaving their meanings together to address my question.`,
        }
      ];
    } else {
      console.warn('getTarotInterpretationStream called without selected_cards. This implies app-drawn cards were not passed or an invalid request.');
      return { error: "No cards provided for interpretation. Please select cards or have the app draw them." };
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', 
      stream: true, // Server action will handle the stream
      messages: messagesForAPI,
      temperature: 0.7,
    });

    const stream = OpenAIStream(response as any); // Keep cast for now, or find appropriate OpenAI type for stream response
    
    // Read the stream internally to return the full string
    // If you want to stream to the client, this action would return `new StreamingTextResponse(stream)`
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

    if (!accumulatedText.trim()) {
      console.error('OpenAI API call in Server Action succeeded but returned empty content.');
      return { error: 'The Oracle pondered but offered no words. The AI returned an empty interpretation. Please try again.' };
    }

    return { interpretation: accumulatedText };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation Error in Server Action:', error.errors);
      return { error: 'Invalid request data', details: error.errors };
    }
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error in Server Action:', error.status, error.message, error.code, error.type);
      return { error: `OpenAI API Error: ${error.message}` };
    }
    console.error('Error in getTarotInterpretationStream server action:', error);
    // It's good to cast the error to Error type to access message property safely
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: `Internal Server Error: ${errorMessage}` };
  }
} 