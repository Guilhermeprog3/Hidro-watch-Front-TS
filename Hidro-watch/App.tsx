import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import { UserProvider } from './src/context/usercontext';
import { ObjectProvider } from './src/context/objectcontext';
import { MeasurementProvider } from './src/context/measurementscontext';
import Routes from './src/routes';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ObjectProvider>
          <MeasurementProvider>
            <Routes />
          </MeasurementProvider>
        </ObjectProvider>
      </UserProvider>
    </AuthProvider>
  );
}