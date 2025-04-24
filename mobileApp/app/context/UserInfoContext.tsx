// context/UserInfoContext.tsx
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Gender = 'male' | 'female' | null;

interface UserInfoContextType {
  name: string;
  gender: Gender;
  fullName: string;
  age: string;
  email: string;
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setFullName: (name: string) => void;
  setAge: (age: string) => void;
  setEmail: (email: string) => void;
  isRegistered: boolean;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');

  const isRegistered = useMemo(() => {
    return name.trim() !== '' && gender !== null;
  }, [name, gender]);

  return (
    <UserInfoContext.Provider value={{
      name,
      gender,
      fullName,
      age,
      email,
      setName,
      setGender,
      setFullName,
      setAge,
      setEmail,
      isRegistered,
    }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) throw new Error('useUserInfo must be used within UserInfoProvider');
  return context;
};
