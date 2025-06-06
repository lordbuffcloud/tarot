import { z } from 'zod';

// Minimal schema for a card when sent as part of an API request
export const ApiCardSchema = z.object({
  card_id: z.string(), // e.g., "major_0"
  name: z.string(),    // e.g., "The Fool"
  is_reversed: z.boolean(),
});
export type ApiCard = z.infer<typeof ApiCardSchema>;

// Comprehensive schema for full card data, based on allCardsData.ts
export const DetailedCardSchema = z.object({
  id: z.string(), // e.g., "major_0"
  name: z.string(),
  imagePath: z.string(), // Note: client components might map this to image_path for Next/Image
  // Optional fields from allCardsData if they exist, or if needed for FullCardType context
  // For example, if you had suit, arcana, meanings in allCardsData, add them here.
  suit: z.string().optional(),
  arcana: z.string().optional(),
  // meaning_up: z.string().optional(),
  // meaning_rev: z.string().optional(),
});
export type FullCardType = z.infer<typeof DetailedCardSchema>;

// Schema for the request body of the /api/interpret endpoint or Server Action
export const InterpretationRequestSchema = z.object({
  question: z.string().min(5, { message: "Question must be at least 5 characters long." }),
  selected_cards: z.array(ApiCardSchema).optional(), // Uses the minimal ApiCardSchema
  spread_image_base64: z.string().optional(), // Added for image-based interpretation
});
export type InterpretationRequest = z.infer<typeof InterpretationRequestSchema>;

// Schema for a card that is part of a spread to be displayed
export const SpreadCardSchema = z.object({
  card: DetailedCardSchema, // Uses the comprehensive DetailedCardSchema
  is_reversed: z.boolean(),
  position_name: z.string().optional(),
  position_description: z.string().optional(),
});
export type SpreadCard = z.infer<typeof SpreadCardSchema>;

// Schema for a Tarot Spread (an array of SpreadCard objects)
export const SpreadSchema = z.array(SpreadCardSchema);

// Infer the TypeScript type for a Spread
export type Spread = z.infer<typeof SpreadSchema>;

// Schema for the successful response from the AI interpretation API
export const InterpretationResponseSchema = z.object({
  interpretation: z.string(),
});
export type InterpretationResponse = z.infer<typeof InterpretationResponseSchema>;

// Schema for error responses from the API
export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.any().optional(), 
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;