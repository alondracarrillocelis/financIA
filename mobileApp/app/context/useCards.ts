// context/useCards.ts
import { useState } from 'react';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (newCard: Card) => {
    setCards((prev) => [...prev, newCard]);
  };

  return { cards, addCard };
}

export interface Card {
  id: string;
  type: string;
  number: string;
  balance: string;
  expiry: string;
  color: string;
}
