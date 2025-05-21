export interface TarotCardPosition {
  id: string;
  name: string;
  description: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  description: string;
  card_positions: TarotCardPosition[];
} 