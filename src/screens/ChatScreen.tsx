import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Para seleccionar imágenes desde la galería
import * as DocumentPicker from 'expo-document-picker'; // Para seleccionar archivos de audio
import { Audio } from 'expo-av'; // Para reproducir audio
import tw from '../styles/tailwind';
import Play from '../../assets/playIcon.svg';
import { User, ChatScreenRouteProp } from '../models/User';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Back from '../../assets/arrowBack.svg'; 
import { collection, addDoc, query, orderBy, onSnapshot, getFirestore, where, or } from 'firebase/firestore';

type ChatScreenProps = StackScreenProps<RootStackParamList, 'Chat'>;

interface Message {
  content: string;
  type: 'text' | 'image' | 'audio';
  senderEmail: string;
  receiverEmail: string;
  participants: string[];
  chatId: string;
  timestamp: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const {user, chatId, userEmail} = route.params
  const [messages, setMessages] = React.useState<{ content: string | null; type: 'text' | 'image' | 'audio'; sentByUser: boolean }[]>([]);
  const [inputText, setInputText] = React.useState<string>('');

  const handleSendTextMessage = async () => {
    if (inputText.trim() !== '') {
      await sendMessage(inputText, 'text', userEmail, user.email);
      setInputText('');
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'audio', senderEmail: string, receiverEmail: string) => {
    const db = getFirestore();
    const messagesCollection = collection(db, 'messages');

    const newMessage = {
      content,
      type,
      senderEmail,
      receiverEmail,
      participants: [senderEmail, receiverEmail],
      chatId: chatId,
      timestamp: Date.now(),
    };

    await addDoc(messagesCollection, newMessage);
  };

  const loadMessages = () => {
    const db = getFirestore();
    const messagesCollection = collection(db, 'messages');

    const q = query(
      messagesCollection,
      where('participants', 'array-contains', userEmail),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push(doc.data() as Message);
      });
      setMessages(loadedMessages);
    });

    return unsubscribe;
  };

  const handleSendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
        console.log(result.assets[0].uri)
      setMessages([...messages, { content: result.assets[0].uri, type: 'image', sentByUser: true }]);
    }
  };

  const handleSendAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
    console.log(result)
    if (result.assets[0].mimeType === 'audio/mpeg') {
      setMessages([...messages, { content: result.assets[0].uri, type: 'audio', sentByUser: true }]);
    }
  };

  const playAudio = async (uri: string | null) => {
    if (!uri) return;
    try {
      console.log('Reproduciendo audio:', uri);
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });
      await sound.playAsync();
      console.log(sound.setProgressUpdateIntervalAsync)
    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };

React.useEffect(() => {
  const db = getFirestore();
  const messagesCollection = collection(db, 'messages');

  const q = query(
    messagesCollection,
    where('chatId', '==', chatId), // Asegúrate de reemplazar 'yourChatId' con el ID de chat actual
    orderBy('timestamp', 'asc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const loadedMessages: { content: string | null; type: 'text' | 'image' | 'audio'; sentByUser: boolean, senderEmail: string | null }[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      loadedMessages.push({
        content: data.content,
        type: data.type,
        sentByUser: data.senderEmail === userEmail,
        senderEmail: data.senderEmail,
      });
    });
    setMessages(loadedMessages);
  });

  return unsubscribe;
}, [userEmail, user.email, chatId]); // Asegúrate de agregar 'yourChatId' a la lista de dependencias

  const renderMessageContent = (message: { content: string | null; type: 'text' | 'image' | 'audio'; sentByUser: boolean }) => {
    const isSentByCurrentUser = message.senderEmail === user.email;
    // Asume que tienes una variable currentUserId que contiene el ID del usuario actual

    switch (message.type) {
      case 'text':
        return <Text style={tw`p-3 text-white`}>{message.content}</Text>;
      case 'image':
        return <Image source={{ uri: message.content || undefined }} style={{ width: 200, height: 200 }} />;
      case 'audio':
        return (
          <TouchableOpacity onPress={() => playAudio(message.content)} style={tw`p-3 rounded-lg`}>
            <Play/>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-customBackground`}>
      <View style={tw`h-16 w-full mt-8 flex justify-center items-center flex-row`}>
        <Back width={30} height={30}></Back>
        <Text style={tw`m-auto text-[15px] text-textGris`}>Chat with {user.name}</Text>
      </View>
      <View style={tw`flex-1 w-full`}>
      <FlatList
      style={tw`flex-1`}
        data={messages}
        renderItem={({ item }) => (
          <View style={[tw`m-2 max-w-52 text-black`, item.sentByUser ? tw`bg-customButton ml-auto rounded-tr-2xl rounded-bl-2xl rounded-tl-2xl` : tw`bg-gray-200 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl`]}>
            {renderMessageContent(item)}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={tw`flex-row p-2`}>
        <TouchableOpacity onPress={handleSendImage} style={tw`p-2 bg-customButton rounded-full`}>
          <Text style={tw`text-white font-bold`}>Enviar Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendAudio} style={tw`ml-2 p-2 bg-customButton rounded-full`}>
          <Text style={tw`text-white font-bold`}>Enviar Audio</Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row p-2`}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Escribe un mensaje..."
          style={tw`text-white flex-1 border border-gray-300 rounded-full p-2`}
          placeholderTextColor="gray"
        />
        <TouchableOpacity onPress={handleSendTextMessage} style={tw`ml-2 p-2 bg-customButton rounded-full`}>
          <Text style={tw`text-white font-bold`}>Enviar Texto</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default ChatScreen;