import React, { createContext, useState, useContext, ReactNode } from 'react';

type Card = {
  id: string;
  title: string;
  description: string;
};

interface CardContextProps {
  selectedCard: Card | null;
  setSelectedCard: (card: Card) => void;
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <CardContext.Provider value={{ selectedCard, setSelectedCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCard = (): CardContextProps => {
  const context = useContext(CardContext);
  if (!context) throw new Error('useCard debe usarse dentro de CardProvider');
  return context;
};
