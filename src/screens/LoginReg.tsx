import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import tw from "../styles/tailwind";
import Logo from "../../assets/icon.svg";
import { Ionicons } from "@expo/vector-icons";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { Colors } from "react-native/Libraries/NewAppScreen";

type LoginReg = StackNavigationProp<RootStackParamList, "Login">;

type Props = {
  navigation: LoginReg;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "K2D",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  textGoogle: {
    fontFamily: "K2D",
    color: "black",
    fontSize: 15,
    textAlign: "center",
  },
  textQuestion:{
    fontFamily: "K2D",
    color: "white",
    fontSize: 15,
    textAlign: "center",
    paddingBottom: 10,
  }
});

const LoginReg: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={tw`flex-1 justify-start items-start bg-customBackground p-4`}>
      <View
        style={tw`flex-1 justify-center items-center bg-customBackground w-full`}
      >
        <View style={tw`h-[50%] w-full`}>
          <View style={tw`h-full w-full flex flex-row justify-center items-end`}>
            <Logo width={60} height={70} color="white"/>
            <Text style={{fontFamily:"K2D", color:"white", fontSize:50, paddingLeft:10, fontWeight:"bold"}}>Sortir</Text>
          </View>
        </View>
        <View style={tw`h-[50%] w-full flex justify-end items-center`}>
          <View style={tw`w-full justify-center items-center`}>
            <TouchableOpacity
              style={tw`bg-customButton p-4 rounded-full my-2 w-full`}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.text}>SING IN WITH EMAIL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-white p-4 rounded-full my-2 w-full mb-4`}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.textGoogle}>SING IN WITH GOOGLE</Text>
            </TouchableOpacity>
            <Text style={styles.textQuestion}>Don't have an account? <Text style={tw`text-blue-200`} onPress={() => navigation.navigate("Register")}>Sign up</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginReg;
