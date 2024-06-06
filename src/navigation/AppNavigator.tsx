import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa HeaderBackButton
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginReg from '../screens/LoginReg';
import ListUsers from '../screens/ListUsers';
import { User } from '../models/User';

export type RootStackParamList = {
  LoginReg: undefined;
  Login: undefined;
  Register: undefined;
  Chat: {user:User};
  List: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
      name="LoginReg" 
      component={LoginReg}
      options={({ navigation }) => ({
        headerShown: false, // Oculta el encabezado de navegación
      })}/>
      <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={({ navigation }) => ({
        headerShown: false, // Oculta el encabezado de navegación

      })} />
      <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={({ navigation }) => ({
        headerShown: false, // Oculta el encabezado de navegación
      })}/>
      <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={({ navigation }) => ({
        headerShown: false, // Oculta el encabezado de navegación
      })}/>
      <Stack.Screen
      name = "List"
      component={ListUsers}
      options={({ navigation }) => ({
        headerShown: false, // Oculta el encabezado de navegación
      })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
