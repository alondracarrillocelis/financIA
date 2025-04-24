import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Gender = 'male' | 'female' | null;

interface UserContextType {
  name: string;
  gender: Gender;
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  isRegistered: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>(null);

  const isRegistered = useMemo(() => {
    return name.trim() !== '' && gender !== null;
  }, [name, gender]);

  return (
    <UserContext.Provider value={{ name, gender, setName, setGender, isRegistered }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
