import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Para seleccionar imágenes desde la galería
import * as DocumentPicker from 'expo-document-picker'; // Para seleccionar archivos de audio
import { Audio } from 'expo-av'; // Para reproducir audio
import tw from '../styles/tailwind';

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = React.useState<{ content: string | null; type: 'text' | 'image' | 'audio'; sentByUser: boolean }[]>([]);
  const [inputText, setInputText] = React.useState<string>('');

  const handleSendTextMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { content: inputText, type: 'text', sentByUser: true }]);
      setInputText('');
    }
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
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };

  const renderMessageContent = (message: { content: string | null; type: 'text' | 'image' | 'audio'; sentByUser: boolean }) => {
    switch (message.type) {
      case 'text':
        return <Text style={tw`p-3 text-white`}>{message.content}</Text>;
      case 'image':
        return <Image source={{ uri: message.content }} style={{ width: 200, height: 200 }} />;
      case 'audio':
        return (
          <TouchableOpacity onPress={() => playAudio(message.content)} style={tw`bg-gray-300 p-3 rounded-lg`}>
            <Text style={tw`text-white`}>Reproducir audio</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-customBackground`}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[tw`m-2 rounded-lg`, item.sentByUser ? tw`bg-customButton` : tw`bg-gray-200`]}>
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
  );
};

export default ChatScreen;
