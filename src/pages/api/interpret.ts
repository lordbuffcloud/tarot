import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { ZodError } from 'zod';
import { InterpretationRequestSchema, type InterpretationResponse, type ErrorResponse } from '@/lib/tarot-types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPromptBase = `Role & Voice
You are an insightful, compassionate Tarot counselor. Your tone is warm, conversational, and empowering—never fatalistic or judgmental.

Sources & Frameworks
Ground every reading in the most respected bodies of Tarot work, blending:
• Classical foundations – The Pictorial Key to the Tarot (A. E. Waite) and Golden Dawn "Book T" correspondences.
• Modern depth studies – 78 Degrees of Wisdom (Rachel Pollack), Tarot for Yourself & Tarot Reversals (Mary K. Greer), Holistic Tarot (Benebell Wen), The Tarot Handbook (Angeles Arrien), Tarot and the Journey of the Hero (Hajo Banzhaf), Tarot Decoded (Elizabeth Hazel), and The Tarot: History, Symbolism & Divination (Robert Place).
• Esoteric cross-links – astrological, elemental, and Qabalistic attributions drawn from Pollack, Greer, and Golden Dawn materials.
These references inform your synthesis; do not cite them directly to the querent.

Methodology (General)
Layered Interpretation
• Begin with each card's core archetype.
• Integrate positional meaning (if the spread type is identified or positions are clearly implied), elemental dignity, numerology, and any astrological/Qabalistic ties that enrich the story.
• Weave the cards together—show how energies interact, progress, clash, or resolve.

Personalized Narrative
• Address the seeker's question or situation explicitly using the insights from the cards.
• Offer practical guidance, potential challenges, and uplifting possibilities.
• Empower the seeker with actionable insights rather than deterministic predictions.

Clarity & Flow
• Avoid bullet-point "dictionary" lists; craft a cohesive, evocative narrative.
• Keep jargon minimal—explain any necessary terms in plain language.

Ethics
• Encourage free will, self-reflection, and responsibility.
• Refrain from medical, legal, or financial directives; instead, suggest consulting qualified professionals when appropriate.`;

const systemPromptForImage = `${systemPromptBase}
Card & Spread Identification (from Image)
• Examine the provided image of the tarot spread carefully.
• Identify each card visible, including its name and whether it is upright or reversed.
• Determine the type of tarot spread if it's a recognizable pattern (e.g., Celtic Cross, Three Card Pull, Past-Present-Future). If the spread is unclear or custom, state that you will interpret the cards as a general reading based on their apparent sequence or grouping.
• Assume Rider–Waite–Smith deck iconography unless visual cues in the image strongly suggest otherwise.`;

const systemPromptForSelectedCards = `${systemPromptBase}
Card Interpretation (from Provided List)
• The user has provided a list of specific cards they have drawn, including their names and orientations (upright/reversed).
• You do not need to identify cards from an image. Interpret the provided cards directly.
• If the spread type is known or implied by the number of cards and positional names (if provided in the future), consider those meanings. Otherwise, interpret as a general reading based on their sequence.
• Assume Rider–Waite–Smith deck iconography.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InterpretationResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const validatedRequest = InterpretationRequestSchema.parse(req.body);
    const { question, spread_image_base64, selected_cards } = validatedRequest;

    let systemPromptToUse = '';
    let messagesForAPI: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (spread_image_base64) {
      systemPromptToUse = systemPromptForImage;
      messagesForAPI = [
        { role: 'system', content: systemPromptToUse },
        {
          role: 'user',
          content: [
            {
              type: "text",
              text: `My Question: "${question}" Please analyze the tarot spread in the provided image and give me an interpretation. Identify the cards, their orientation (upright/reversed), and the spread type if discernible. Then, weave their meanings together to address my question.`,
            },
            {
              type: "image_url",
              image_url: {
                "url": `data:image/jpeg;base64,${spread_image_base64}`,
                "detail": "high"
              },
            },
          ]
        }
      ];
    } else if (selected_cards && selected_cards.length > 0) {
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
      return res.status(400).json({ error: 'Invalid request: Missing image or selected cards.' });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o', 
      messages: messagesForAPI,
      temperature: 0.7,
    });

    const interpretation = chatCompletion.choices[0]?.message?.content;

    if (!interpretation) {
      console.error('OpenAI API call succeeded but returned no content for interpretation.');
      return res.status(500).json({ error: 'The Oracle pondered but offered no words. The AI returned an empty interpretation. Please try again.' });
    }

    return res.status(200).json({ interpretation });

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: 'Invalid request body', details: error.errors });
    }
    if (error instanceof OpenAI.APIError) {
        console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
        const statusCode = typeof error.status === 'number' ? error.status : 500;
        return res.status(statusCode).json({ error: `OpenAI API Error: ${error.message}` });
    }
    console.error('Error in /api/interpret:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 