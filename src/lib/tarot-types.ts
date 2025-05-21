import { z } from 'zod';

// Schema for a single Tarot Card, matching tarot.json structure
export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  suit: z.enum(["Major Arcana", "Wands", "Cups", "Swords", "Pentacles"]),
  arcana: z.enum(["Major", "Minor"]),
  number: z.number(), // Could also be a string if you have 'Page', 'Knight' etc. directly
  image_path: z.string().optional(), // Assuming image path might not always be present
  meaning_up: z.string(),
  meaning_rev: z.string(),
  // Add any other fields you might have, e.g., keywords, astrological associations
  // keywords: z.array(z.string()).optional(),
});

// Infer the TypeScript type from the schema
export type Card = z.infer<typeof CardSchema>;

// Schema for a card within a spread, including its orientation
export const SpreadCardSchema = z.object({
  card: CardSchema, // Embed the Card schema
  position_name: z.string().optional(), // e.g., "Past", "Present", "Future", "Outcome"
  is_reversed: z.boolean(),
});

// Infer the TypeScript type for a card in a spread
export type SpreadCard = z.infer<typeof SpreadCardSchema>;

// Schema for a Tarot Spread (an array of SpreadCard objects)
export const SpreadSchema = z.array(SpreadCardSchema);

// Infer the TypeScript type for a Spread
export type Spread = z.infer<typeof SpreadSchema>;

// Schema for the request body of the /api/interpret endpoint
export const InterpretationRequestSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  spread_name: z.string().min(1, "Spread name cannot be empty"), // e.g., "Celtic Cross", "Three Card Pull"
  cards: z.array(SpreadCardSchema).min(1, "At least one card must be provided for interpretation"),
});

// Infer the TypeScript type for the interpretation request
export type InterpretationRequest = z.infer<typeof InterpretationRequestSchema>;

// Example usage (optional, for testing or demonstration):
/*
const allCardsData: unknown = []; // Assume this is your tarot.json data loaded

export const DeckSchema = z.array(CardSchema);

try {
  const validatedDeck = DeckSchema.parse(allCardsData);
  console.log("Deck is valid:", validatedDeck.length, "cards");
} catch (error) {
  console.error("Deck validation error:", error);
}

const exampleSpread: Spread = [
  {
    card: { 
      id: 'major_0', 
      name: 'The Fool', 
      suit: 'Major Arcana', 
      arcana: 'Major', 
      number: 0, 
      image_path: '/cards/major_00.jpg', 
      meaning_up: 'Beginnings...', 
      meaning_rev: 'Naivety...'
    },
    position_name: 'Current Situation',
    is_reversed: false,
  },
  {
    card: { 
      id: 'major_1', 
      name: 'The Magician', 
      suit: 'Major Arcana', 
      arcana: 'Major', 
      number: 1, 
      image_path: '/cards/major_01.jpg', 
      meaning_up: 'Manifestation...', 
      meaning_rev: 'Manipulation...'
    },
    position_name: 'Obstacle',
    is_reversed: true,
  },
];

try {
  const validatedSpread = SpreadSchema.parse(exampleSpread);
  console.log("Spread is valid:", validatedSpread);
} catch (error) {
  console.error("Spread validation error:", error);
}
*/ 