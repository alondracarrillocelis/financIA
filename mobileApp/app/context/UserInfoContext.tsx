import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Gender = 'male' | 'female' | null;

interface UserInfoContextType {
  firstName: string;
  lastName: string;
  gender: Gender;
  age: string;
  email: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: string) => void;
  setEmail: (email: string) => void;
  isRegistered: boolean;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');

  const isRegistered = useMemo(() => {
    return firstName.trim() !== '' && gender !== null;
  }, [firstName, gender]);

  return (
    <UserInfoContext.Provider value={{
      firstName,
      lastName,
      gender,
      age,
      email,
      setFirstName,
      setLastName,
      setGender,
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
