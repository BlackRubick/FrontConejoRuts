import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "../styles/tailwind";
import ReturnLayout from "./layouts/ReturnLayout";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { useUserStore } from "../store/UserStore";
import { User } from "../models/User";

type ListUsers = StackNavigationProp<RootStackParamList, "List">;

type Props = {
  navigation: ListUsers;
};

const ListUsers: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList: User[] = userSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { name: data.name, email: data.email };
      });
      setUsers(userList);
    };

    fetchUsers();
  }, []);

const createChat = async (user1Email: string, user2Email: string) => {
  const db = getFirestore();
  const chatsCollection = collection(db, "chats");
  const q1 = query(chatsCollection, where("userEmails", "array-contains", user1Email));
  const querySnapshot1 = await getDocs(q1);
  const q2 = query(chatsCollection, where("userEmails", "array-contains", user2Email));
  const querySnapshot2 = await getDocs(q2);
  const commonChats = querySnapshot1.docs.filter(doc1 => 
    querySnapshot2.docs.some(doc2 => doc1.id === doc2.id)
  );

  if (commonChats.length > 0) {
    return commonChats[0].id;
  } else {
    const chatDoc = await addDoc(chatsCollection, {
      userEmails: [user1Email, user2Email],
    });

    return chatDoc.id;
  }
};

  const startChat = async (userEmail: string, usersParam: User) => {
    const chatId = await createChat(currentUser?.email, userEmail);
    console.log(chatId);
    navigation.navigate("Chat", {user:usersParam, chatId: chatId, userEmail: currentUser?.email });
  };

  return (
    <ReturnLayout goBack={() => navigation.goBack()}>
      {users.map((user, index) => (
        currentUser && currentUser.email !== user.email && (
        <TouchableOpacity
            onPress={() => startChat(user.email, user)}
            style={tw`h-12 flex justify-center items-center border rounded-xl mt-4 border-gray-500`}>
            <Text key={index} style={tw`text-[20px] text-white`}>{user.name}</Text>
        </TouchableOpacity>
        )
      ))}
    </ReturnLayout>
  );
};
export default ListUsers;