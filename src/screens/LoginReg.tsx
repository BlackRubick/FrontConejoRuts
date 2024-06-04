import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import tw from '../styles/tailwind';
import Logo from '../../assets/animate-logo.svg';
import { Ionicons } from '@expo/vector-icons';

type LoginReg = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginReg;
};

const LoginReg: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-start items-start bg-customBackground p-4`}>
        <View style={tw`flex-1 justify-center items-center bg-customBackground w-full`}>
        <Logo width={200} height={200} />
        <View style={tw`pt-16 justify-center items-center w-full`}>
            <TouchableOpacity
                style={tw`bg-customButton p-4 rounded-full my-2 w-4/5`} // 80% del ancho del contenedor
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={tw`text-customButtonText text-center`}>SIGN IN WITH EMAIL</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={tw`bg-customButton p-4 rounded-full my-2 w-4/5`} // 80% del ancho del contenedor
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={tw`text-customButtonText text-center`}>REGISTER WITH EMAIL</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>

  );
};

export default LoginReg;
