import React, { ReactNode } from 'react';
import { UserInfoProvider } from './UserInfoContext';
import { AppStateProvider } from './AppStateContext';

export const AppProvider = ({ children }: { children: ReactNode }) => (
  <UserInfoProvider>
    <AppStateProvider>
      {children}
    </AppStateProvider>
  </UserInfoProvider>
);
