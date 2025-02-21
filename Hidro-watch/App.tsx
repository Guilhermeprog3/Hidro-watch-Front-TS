import React from 'react';
import { AuthProvider } from './src/context/authContext';
import { UserProvider } from './src/context/userContext';
import { ObjectProvider } from './src/context/objectContext';
import Routes from './src/routes';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ObjectProvider>
          <Routes />
        </ObjectProvider>
      </UserProvider>
    </AuthProvider>
  );
}