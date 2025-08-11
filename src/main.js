// // import './assets/main.css'
// // import '@/assets/style.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

// import PrimeVue from 'primevue/config' 
// import Aura from '@primevue/themes/aura' 

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router/index.js' // 确保这里是 './router/index.js'
// import { initializeApp } from 'firebase/app'; // 导入 Firebase 初始化函数
// import { ref, reactive } from 'vue'; 

// const authState = reactive({
//   isAuthenticated: false,
//   currentUser: null,
//   userRole: null,
//   isAuthResolved: false // 表示 Firebase 认证状态是否已解析
// });

// const firebaseConfig = {
//   apiKey: "AIzaSyBhciI42qqrCYPG3gu6T-zbL1hsnszKj4s",
//   authDomain: "week7-jingyi.firebaseapp.com",
//   projectId: "week7-jingyi",
//   storageBucket: "week7-jingyi.firebasestorage.app",
//   messagingSenderId: "955498602579",
//   appId: "1:955498602579:web:b1c478dcb770d04f3b66a6"
// };
// // 先初始化 Firebase 应用
// // 直接调用 initializeApp，不将其返回值赋给 'app' 变量，避免与 Vue 应用的 'app' 变量冲突。
// initializeApp(firebaseConfig); 


// // 创建 Vue 应用实例
// const app = createApp(App) 

// //  PrimeVue 和 Vue Router 插件应用到 Vue 应用实例上
// app.use(PrimeVue, { theme: { preset: Aura } })
// app.use(router) 

// // 挂载 Vue 应用
// app.mount('#app')

// // 其他被注释掉的行，例如 PrimeVue DataTable 和 Column 组件注册可以保留或删除
// // import DataTable from 'primevue/datatable'
// // import Column from 'primevue/Column'
// // app.component('DataTable', DataTable)
// // app.component('Column', Column)

// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/optimization.css' // Lab 12.3 性能优化样式

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import { createApp, reactive } from 'vue' // <-- 导入 reactive
import App from './App.vue'
import router from './router/index.js' // 确保这里是 './router/index.js'
import { initializeApp } from 'firebase/app'; // 导入 Firebase 初始化函数
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // 导入 Firebase Auth 函数
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // 导入 Firestore 函数

// 您的 web 应用的 Firebase 配置
// 从 Firebase 控制台复制粘贴您的 firebaseConfig 对象到这里
const firebaseConfig = {
  apiKey: "AIzaSyBhciI42qqrCYPG3gu6T-zbL1hsnszKj4s",
  authDomain: "week7-jingyi.firebaseapp.com",
  projectId: "week7-jingyi",
  storageBucket: "week7-jingyi.firebasestorage.app",
  messagingSenderId: "955498602579",
  appId: "1:955498602579:web:b1c478dcb770d04f3b66a6"
};

// 先初始化 Firebase 应用
const firebaseApp = initializeApp(firebaseConfig); // <-- 使用不同变量名以避免冲突
const auth = getAuth(firebaseApp); // <-- 获取 Firebase Auth 实例
const db = getFirestore(firebaseApp); // <-- 获取 Firestore 实例

// 全局认证状态对象
const authState = reactive({ // <-- 定义全局响应式状态
  isAuthenticated: false,
  currentUser: null,
  userRole: null,
  isAuthResolved: false // 新增：表示 Firebase 认证状态是否已解析
});

// 在这里监听 Firebase 认证状态变化
// 这个监听器会在应用初始化时触发一次，并在用户登录/注销时再次触发
onAuthStateChanged(auth, async (user) => {
  authState.currentUser = user; // 设置当前用户对象
  authState.isAuthenticated = !!user; // 根据 user 是否存在设置认证状态

  if (user) {
    // 用户已登录
    console.log('Firebase user is logged in:', user.email, 'UID:', user.uid);

    // 获取并存储用户角色
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      authState.userRole = userData.role; // 设置用户角色
      console.log('User Role from Firestore:', userData.role);
    } else {
      console.warn('User data not found in Firestore for UID:', user.uid);
      authState.userRole = 'default_user'; // 默认未知角色
    }
  } else {
    // 用户未登录
    console.log('Firebase user is logged out.');
    authState.userRole = null; // 清除角色信息
  }
  authState.isAuthResolved = true; // 表示认证状态已解析
});


// 创建 Vue 应用实例
const app = createApp(App)

// 将 authState 挂载到 Vue 应用实例的全局属性上
app.config.globalProperties.$authState = authState; // <-- 挂载全局状态

// 将 PrimeVue 和 Vue Router 插件应用到 Vue 应用实例上
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

// 挂载 Vue 应用
app.mount('#app')

// 其他被注释掉的行可以保持或删除
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'
// app.component('DataTable', DataTable)
// app.component('Column', Column)