import { AuthProvider } from "./src/context/authContext";
import Routes from "./src/routes";
export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
    
  );
}