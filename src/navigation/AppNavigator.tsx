import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/Home';


export type RootStackParamList = {

  Home:undefined;

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
    </Stack.Navigator>
  );
};

export default AppNavigator;