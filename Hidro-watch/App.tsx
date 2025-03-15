import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import { UserProvider } from './src/context/usercontext';
import { ObjectProvider } from './src/context/objectcontext';
import { MeasurementProvider } from './src/context/measurementscontext';
import Routes from './src/routes';
import { MenuProvider } from 'react-native-popup-menu';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';

enableScreens();

export default function App() {
  return (
    <MenuProvider>
      <AuthProvider>
      <UserProvider>
        <ObjectProvider>
          <MeasurementProvider>
            <Routes />
          </MeasurementProvider>
        </ObjectProvider>
      </UserProvider>
    </AuthProvider>
    </MenuProvider>
  );
}