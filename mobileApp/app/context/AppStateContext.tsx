// context/AppStateContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useUserInfo } from './UserInfoContext';

interface AppStateContextType {
  theme: 'light' | 'dark' | null;
  toggleTheme: () => void;
  lastActiveTab: string;
  setLastActiveTab: (tab: string) => void;
  isRegistered: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { name, gender, isRegistered } = useUserInfo(); // ahora sí están aquí
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [lastActiveTab, setLastActiveTab] = useState('dash');

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  return (
    <AppStateContext.Provider
      value={{
        theme,
        toggleTheme,
        lastActiveTab,
        setLastActiveTab,
        isRegistered,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
};
