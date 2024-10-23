// 从您需要的 SDK 中导入您需要的函数
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO：为要使用的 Firebase 产品添加 SDK
// https://firebase.google.com/docs/web/setup#available-libraries

// Web 应用的 Firebase 配置
// 对于 Firebase JS SDK v7.20.0 及更高版本，measurementId 为可选
const firebaseConfig = {
  apiKey: "AIzaSyCXuB9w8Q9m_pbl2NohU4_oEUTuQLQF8Gc",
  authDomain: "singing-vue-t.firebaseapp.com",
  projectId: "singing-vue-t",
  storageBucket: "singing-vue-t.appspot.com",
  messagingSenderId: "708151314137",
  appId: "1:708151314137:web:156d23b8279dcbe77e20c8",
  measurementId: "G-1CD0KFEW64"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// 获取对存储服务的引用，该服务用于在存储桶中创建引用
const storage = getStorage();
// 从我们的存储服务创建存储引用
const originalRef = ref(storage, 'original');
const thumbnailsRef = ref(storage, 'thumbnails');

export { db, storage, originalRef, thumbnailsRef };