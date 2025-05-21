import { Card } from '@/lib/tarot-types';
import CardThumbnail from './CardThumbnail';

interface CardGridProps {
  cards: Card[];
  selectedCards?: Card[];
  onCardClick?: (card: Card) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function CardGrid({ 
  cards, 
  selectedCards = [], 
  onCardClick,
  size = 'md'
}: CardGridProps) {
  if (!cards || cards.length === 0) {
    return null; // Or some placeholder if preferred when no cards are selected
  }

  return (
    <div 
      className={`
        grid gap-5 p-4 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6
        place-items-center
      `}
    >
      {cards.map((card) => (
        <CardThumbnail
          key={card.id}
          card={card}
          size={size}
          onClick={onCardClick ? () => onCardClick(card) : undefined}
          selected={selectedCards.some(selected => selected.id === card.id)}
        />
      ))}
    </div>
  );
} 