import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import { UserProvider } from './src/context/usercontext';
import { ObjectProvider } from './src/context/objectcontext';
import { MeasurementProvider } from './src/context/measurementscontext';
import Routes from './src/routes/index';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeProvider } from './src/context/themecontext';
import { enableScreens } from 'react-native-screens';

enableScreens();

const App: React.FC = () => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default App;