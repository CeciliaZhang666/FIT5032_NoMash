// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- 导入 getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhciI42qqrCYPG3gu6T-zbL1hsnszKj4s",
  authDomain: "week7-jingyi.firebaseapp.com",
  projectId: "week7-jingyi",
  storageBucket: "week7-jingyi.firebasestorage.app",
  messagingSenderId: "955498602579",
  appId: "1:955498602579:web:b1c478dcb770d04f3b66a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const db = getFirestore(app); // <-- 初始化 Firestore

export default db; // <-- 导出 db 实例