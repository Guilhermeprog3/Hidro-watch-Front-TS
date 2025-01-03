import { NavigationContainer } from '@react-navigation/native';
import PublicRoutes from './public_routes';
import PrivateRoutes from './private_routes';
import { useAuth } from '../hooks/Auth';

const Routes = () => {
  const {user} = useAuth()
  return (
    <NavigationContainer>
      {user?.token ? <PrivateRoutes /> : <PublicRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
