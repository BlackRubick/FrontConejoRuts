import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import tw from '../styles/tailwind';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-start items-start bg-customBackground p-4`}>
        <TouchableOpacity style={tw`mb-20`} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      <Text style={tw`text-4xl font-bold text-white mb-4`}>Login</Text>
      <View style={tw`w-full border-b border-textGris mb-12`}>
        <TextInput placeholder="Email" style={tw`p-2 text-textGris`} placeholderTextColor="textGris" />
      </View>
      <View style={tw`w-full border-b border-textGris  mb-12`}>
        <TextInput placeholder="Password" secureTextEntry style={tw`p-2 text-textGris`} placeholderTextColor="textGris" />
      </View>
      <View style={tw`w-full justify-center items-center mt-8`}>
        <TouchableOpacity
                style={tw`bg-customButton p-4 rounded-full my-2 w-4/5`} // 80% del ancho del contenedor
                onPress={() => navigation.navigate('Chat')}
            >
                <Text style={tw`text-customButtonText text-center`}>Login</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
