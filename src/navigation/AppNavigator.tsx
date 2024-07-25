import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import { useUser } from '../contexts/UserContext'; // Importa el hook de contexto de usuario

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { userName } = useUser(); // Obtén el nombre del usuario del contexto de usuario

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false, // Oculta el header en la pantalla de inicio
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }} // Oculta el header en la pantalla de inicio de sesión
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
