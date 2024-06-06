import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import tw from "../styles/tailwind";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { firebase } from "../core/firebase/config";
import ReturnLayout from "./layouts/ReturnLayout";
import { useUserStore } from "../store/UserStore";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addUSer = useUserStore((state) => state.set);

  const auth = getAuth(firebase);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addUSer({email: email});
      navigation.navigate("List");
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <ReturnLayout goBack={()=>navigation.goBack()}>
        <Text style={tw`text-[38px] font-bold text-white mb-8`}>Login</Text>
        <View style={tw`w-full border-b border-textGris mb-8`}>
          <TextInput
            placeholder="Email"
            style={tw`p-2 text-textGris text-[15px]`}
            placeholderTextColor="gray"
            onChangeText={(text) => setEmail(text)}
            value={email}
            />
        </View>
        <View style={tw`w-full border-b border-textGris mb-8`}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={tw`p-2 text-textGris text-[15px]`}
            placeholderTextColor="gray"
            onChangeText={(text) => setPassword(text)}
            value={password}
            />
        </View>
        <View style={tw`w-full justify-center items-center mt-4`}>
          <TouchableOpacity
            style={tw`bg-customButton p-4 rounded-full my-2 w-full`}
            onPress={handleLogin}
            >
            <Text style={tw`text-customButtonText text-center`}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ReturnLayout>
  );
};

export default LoginScreen;
