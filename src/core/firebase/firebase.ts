import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  where,
  DocumentData,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export const sendMessage = async (
  content: string,
  type: "text" | "image" | "audio",
  senderEmail: string,
  receiverEmail: string,
  chatId: string
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

export const loadMessages = async (chatId: string) => {
  const db = getFirestore();
  const messagesCollection = collection(db, "messages");
  const q = query(messagesCollection, where("chatId", "==", chatId), orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    return messages;
  });

  return unsubscribe;
};

export const uploadFile = async (uri: string, path: string) => {
  const blob = await fetch(uri).then((res) => res.blob());
  const storage = getStorage();
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progreso de la subida
      },
      (error) => {
        // Error
        reject(error);
      },
      () => {
        // Subida completada
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};