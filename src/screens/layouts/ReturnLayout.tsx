import React from "react";
import { View, TouchableOpacity } from "react-native";
import tw from "../../styles/tailwind";
import Back from "../../../assets/arrowBack.svg";

type ReturnLayoutProps = {
  goBack: () => void;
  children?: React.ReactNode;
};

const ReturnLayout: React.FC<ReturnLayoutProps> = ({ goBack, children }) => {
  return (
    <View style={tw`flex-1 justify-start items-start bg-customBackground p-4`}>
      <TouchableOpacity
        style={tw`mt-8 mb-16`}
        onPress={goBack}
      >
        <Back width={30} height={30} color="white" />
      </TouchableOpacity>
      <View style={tw`w-[90%] ml-auto mr-auto h-[60%]`}>
        {children}
      </View>
    </View>
  );
};

export default ReturnLayout;