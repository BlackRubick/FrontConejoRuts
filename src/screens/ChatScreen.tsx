import React, { useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import tw from "../styles/tailwind";
import Play from "../../assets/playIcon.svg";
import { User, ChatScreenRouteProp } from "../models/User";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Back from "../../assets/arrowBack.svg";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  where,
  or,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Video } from "expo-av";
import SedArrow from "../../assets/SedArrow.svg";

type ChatScreenProps = StackScreenProps<RootStackParamList, "Chat">;

interface Message {
  content: string;
  type: "text" | "image" | "audio";
  senderEmail: string;
  receiverEmail: string;
  participants: string[];
  chatId: string;
  timestamp: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const videoRefs = useRef<Map<string, React.RefObject<Video>>>(new Map());
  let sound: Audio.Sound | null = null;
  const { user, chatId, userEmail } = route.params;
  const [messages, setMessages] = React.useState<
    {
      content: string | null;
      type: "text" | "image" | "audio"| "video";
      sentByUser: boolean;
    }[]
  >([]);
  const [inputText, setInputText] = React.useState<string>("");

  const handleSendTextMessage = async () => {
    if (inputText.trim() !== "") {
      await sendMessage(inputText, "text", userEmail, user.email);
      setInputText("");
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const sendMessage = async (
    content: string,
    type: "text" | "image" | "audio" | "video",
    senderEmail: string,
    receiverEmail: string
  ) => {
    const db = getFirestore();
    const messagesCollection = collection(db, "messages");

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
    const messagesCollection = collection(db, "messages");

    const q = query(
      messagesCollection,
      where("participants", "array-contains", userEmail),
      orderBy("timestamp", "asc")
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
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "images/" + result.assets[0].uri.split("/").pop()
      );

      const imageBlob = await uriToBlob(result.assets[0].uri);

      const uploadTask = uploadBytesResumable(storageRef, imageBlob, {
        contentType: "image/jpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            sendMessage(downloadURL, "image", userEmail, user.email);
            setMessages([
              ...messages,
              { content: downloadURL, type: "image", sentByUser: true },
            ]);
          });
        }
      );
    }
  };

  const handleSendAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });
    if (result) {
      const storage = getStorage();
      const uri = result.assets[0].uri;
      const storageRef = ref(storage, "audios/" + uri.split("/").pop());

      // Leer el archivo en un Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const uploadTask = uploadBytesResumable(storageRef, blob, {
        contentType: "audio/mpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            sendMessage(downloadURL, "audio", userEmail, user.email);
            setMessages([
              ...messages,
              { content: downloadURL, type: "audio", sentByUser: true },
            ]);
          });
        }
      );
    }
  };

  const handleSendVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "videos/" + result.assets[0].uri.split("/").pop()
      );

      const videoBlob = await uriToBlob(result.assets[0].uri);

      const uploadTask = uploadBytesResumable(storageRef, videoBlob, {
        contentType: "video/mp4",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            sendMessage(downloadURL, "video", userEmail, user.email);
            setMessages([
              ...messages,
              { content: downloadURL, type: "video", sentByUser: true },
            ]);
          });
        }
      );
    }
  };

  const playAudio = async (uri: string | null) => {
    if (!uri) return;
    try {
      console.log("Reproduciendo audio:", uri);
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      sound = new Audio.Sound();

      sound.setOnPlaybackStatusUpdate((status) => {
        if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
          sound?.unloadAsync();
          sound = null;
        }
      });

      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
    }
  };

  React.useEffect(() => {
    const db = getFirestore();
    const messagesCollection = collection(db, "messages");

    const q = query(
      messagesCollection,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages: {
        content: string | null;
        type: "text" | "image" | "audio" |  "video";
        sentByUser: boolean;
        senderEmail: string | null;
      }[] = [];
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
  }, [userEmail, user.email, chatId]);

  const renderMessageContent = (message: {
    content: string | null;
    type: "text" | "image" | "audio" | "video";
    sentByUser: boolean;
  }) => {
    const isSentByCurrentUser = message.senderEmail === user.email;

    switch (message.type) {
      case "video":
        if (!videoRefs.current.has(message.content!)) {
          videoRefs.current.set(message.content!, React.createRef());
        }
  
        return (
          <TouchableOpacity
            onPress={() => {
              const videoRef = videoRefs.current.get(message.content!);
              if (videoRef?.current) {
                videoRef.current.getStatusAsync().then((status) => {
                  if (status.isPlaying) {
                    videoRef.current?.pauseAsync();
                  } else {
                    videoRef.current?.playAsync();
                  }
                });
              }
            }}
          >
            <Video
              ref={videoRefs.current.get(message.content!)}
              source={{ uri: message.content }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={false}
              isLooping
              style={tw `w-[200px] h-[200px] rounded-2xl`}
            />
          </TouchableOpacity>
        );
      case "text":
        return (
          <Text
            style={[
              tw`p-3 text-white`,
              message.sentByUser ? tw`text-white` : tw`text-black`,
            ]}
          >
            {message.content}
          </Text>
        );
      case "image":
        return (
          <Image
            style={tw`w-[200px] h-[200px] rounded-2xl`}
            source={{ uri: message.content || undefined }}
          />
        );
      case "audio":
        return (
          <TouchableOpacity
            onPress={() => playAudio(message.content)}
            style={tw`p-3 rounded-lg`}
          >
            <Play style={tw``} fill="black" />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={tw`flex-1 bg-customBackground`}>
      <View
        style={tw`h-16 w-full mt-8 flex justify-center items-center flex-row`}
      >
        <Back width={30} height={30}></Back>
        <Text style={tw`m-auto text-[15px] text-textGris`}>
          Chat with {user.name}
        </Text>
      </View>
      <View style={tw`flex-1 w-full`}>
        <FlatList
          style={tw`flex-1`}
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                tw`m-2 max-w-52 p-[1px]`,
                item.sentByUser
                  ? tw`bg-customButton ml-auto rounded-tr-2xl rounded-bl-2xl rounded-tl-2xl`
                  : tw`bg-gray-200 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl`,
              ]}
            >
              {renderMessageContent(item)}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={tw`flex-row p-2`}>
          <TouchableOpacity
            onPress={handleSendImage}
            style={tw`p-2 bg-customButton rounded-full`}
          >
            <Text style={tw`text-white font-bold`}>Enviar Imagen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendAudio}
            style={tw`ml-2 p-2 bg-customButton rounded-full`}
          >
            <Text style={tw`text-white font-bold`}>Enviar Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendVideo}
            style={tw`ml-2 p-2 bg-customButton rounded-full`}
          >
            <Text style={tw`text-white font-bold`}>Enviar viedeo</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row p-2`}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe un mensaje..."
            style={tw`text-white flex-1 relative border border-gray-300 rounded-2xl pt-2 pl-4 pr-[18%] pb-2 max-h-[100px]`}
            multiline
            placeholderTextColor="gray"
          />
          <TouchableOpacity
            onPress={handleSendTextMessage}
            style={tw`p-2 bg-customButton rounded-2xl absolute right-[4%] mt-[4%]`}
          >
            <SedArrow width={30} height={20}></SedArrow>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
