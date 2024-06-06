import React from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import tw from "../styles/tailwind";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { firebase } from "./../core/firebase/config";
import ReturnLayout from "./layouts/ReturnLayout";
import { getFirestore, doc, setDoc } from "firebase/firestore";

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Register"
>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const auth = getAuth(firebase);
  const db = getFirestore(firebase);

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
        }
        try {
          await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
          });
        } catch (error) {
          console.error("Error writing to Firestore: ", error);
        }
      }
      navigation.navigate('LoginReg');
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };
  
  return (
    <ReturnLayout goBack={() => navigation.goBack()}>
      <Text style={tw`text-[38px] font-bold text-white mb-12`}>Register</Text>
      <View style={tw`w-full border-b border-textGris mb-8`}>
        <TextInput
          placeholder="Name"
          style={tw`p-2 text-textGris text-white text-[15px]`}
          placeholderTextColor="gray"
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
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
      <View style={tw`w-full justify-center items-center mt-8`}>
        <TouchableOpacity
          style={tw`bg-customButton p-4 rounded-full my-2 w-full`}
          onPress={() => registerWithEmail(email, password, name)}
        >
          <Text style={tw`text-customButtonText text-center`}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </ReturnLayout>
  );
};

export default RegisterScreen;
