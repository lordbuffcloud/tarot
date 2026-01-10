import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { InterpretationRequestSchema } from '@/lib/tarot-types';

// Validate environment variable
if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Base system prompt
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

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const validatedRequest = InterpretationRequestSchema.parse(json);
        const { question, selected_cards } = validatedRequest;

        let messagesForAPI: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

        if (selected_cards && selected_cards.length > 0) {
            const cardDetailsString = selected_cards.map(card =>
                `${card.name}${card.is_reversed ? ' (Reversed)' : ' (Upright)'}`
            ).join(', ');

            messagesForAPI = [
                { role: 'system', content: systemPromptForSelectedCards },
                {
                    role: 'user',
                    content: `My Question: "${question}". The cards I have drawn are: ${cardDetailsString}. Please provide an interpretation based on these cards, weaving their meanings together to address my question.`,
                }
            ];
        } else {
            return new Response("No cards provided for interpretation.", { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            stream: true,
            messages: messagesForAPI,
            temperature: 0.7,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.error('Error in interpretation API:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
