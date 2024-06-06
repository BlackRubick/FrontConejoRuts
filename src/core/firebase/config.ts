import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmM3LWVPrNS3VrW0lUS8T1Qvqig_u6T20",
  authDomain: "message-8f822.firebaseapp.com",
  projectId: "message-8f822",
  storageBucket: "message-8f822.appspot.com",
  messagingSenderId: "193603505481",
  appId: "1:193603505481:web:9cd58968f6d57bbc145e98",
  measurementId: "G-6BJZXRY8WQ"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app as firebase , db};