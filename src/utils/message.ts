import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";

export const sendMessage = async (
  content: any,
  type: any,
  senderEmail: any,
  receiverEmail: any,
  chatId: String
) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      content: content,
      type: type,
      senderEmail,
      receiverEmail,
      participants: [senderEmail, receiverEmail],
      chatId: chatId,
      timestamp: Date.now(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const sendVideoMessage = async (
  userEmail: any,
  recipientEmail: any,
  setMessages: (arg0: any[]) => void,
  messages: any,
  chatId: String
) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "video/*",
    copyToCacheDirectory: true,
  });
  if (result) {
    const storage = getStorage();
    const uri = result.assets[0].uri;
    const storageRef = ref(storage, "videos/" + uri.split("/").pop());

    // Leer el archivo en un Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(storageRef, blob, {
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
          sendMessage(downloadURL, "video", userEmail, recipientEmail, chatId);
          setMessages([
            ...messages,
            { content: downloadURL, type: "video", sentByUser: true },
          ]);
        });
      }
    );
  }
};

export const sendAudioMessage = async (
  userEmail: any,
  recipientEmail: any,
  setMessages: (arg0: any[]) => void,
  messages: any,
  chatId: String
) => {
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
          sendMessage(downloadURL, "audio", userEmail, recipientEmail, chatId);
          setMessages([
            ...messages,
            { content: downloadURL, type: "audio", sentByUser: true },
          ]);
        });
      }
    );
  }
};

export const sendTextMessage = (
  content: any,
  userEmail: any,
  recipientEmail: any,
  setMessages: (arg0: any[]) => void,
  messages: any,
  chatId: String
) => {
  sendMessage(content, "text", userEmail, recipientEmail, chatId);
  setMessages([
    ...messages,
    { content: content, type: "text", sentByUser: true },
  ]);
};

export const sendImageMessage = async (
  userEmail: any,
  recipientEmail: any,
  setMessages: (arg0: any[]) => void,
  messages: any,
  chatId: String
) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "image/*",
    copyToCacheDirectory: true,
  });
  if (result) {
    const storage = getStorage();
    const uri = result.assets[0].uri;
    const storageRef = ref(storage, "images/" + uri.split("/").pop());

    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(storageRef, blob, {
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
          sendMessage(downloadURL, "image", userEmail, recipientEmail, chatId);
          setMessages([
            ...messages,
            { content: downloadURL, type: "image", sentByUser: true },
          ]);
        });
      }
    );
  }
}
