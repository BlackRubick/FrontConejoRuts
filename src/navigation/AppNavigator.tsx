import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login'
import Home from '../screens/Home';

export type RootStackParamList = {

  Home:undefined;
  Login:undefined
  Register:undefined
};

const Stack = createStackNavigator<RootStackParamList>();

//este es como el browserrouter xd 

const AppNavigator: React.FC = () => {
  return (
    
    <Stack.Navigator>



      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }} 
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;