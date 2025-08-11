import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
// import BooksView from '../views/BooksView.vue' // <-- 删除或注释掉这一行，因为我们没有这个文件

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import AddBookView from '../views/AddBookView.vue'; // lab8
import WeatherView from '../views/WeatherView.vue'; // lab10
import CountBookAPI from '../views/CountBookAPI.vue'; // lab10
import GetAllBookAPI from '../views/GetAllBookAPI.vue'; // lab10

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true, requiredRoles: ['admin'] } // 示例：只有 'admin' 才能访问 About
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/add-book', // 添加 AddBook 路由
    name: 'AddBook',
    component: AddBookView,
    // meta: { requiresAuth: true, requiredRoles: ['admin'] } 保护此页面
  },
  {
    path: '/books', // 添加 Books 路由
    name: 'Books', // 路由名称可以保持为 Books
    component: AddBookView // <-- 关键修改：指向 AddBookView，因为它包含 BookList
  },
  { // <-- 添加天气的路由
    path: '/WeatherCheck', // <-- 路由路径为 /WeatherCheck 
    name: 'GetWeather',    // <-- 路由名称为 GetWeather 
    component: WeatherView // <-- 指向 WeatherView.vue 页面
  },
  { 
    path: '/CountBookAPI', // <-- 路由路径为 /CountBookAPI
    name: 'CountBookAPI',    // <-- 路由名称为 CountBookAPI
    component: CountBookAPI // <-- 指向 CountBookAPI.vue 页面
  },
  { 
    path: '/GetAllBookAPI', // <-- 路由路径为 /GetAllBookAPI
    name: 'GetAllBookAPI',  // <-- 路由名称为 GetAllBookAPI
    component: GetAllBookAPI // <-- 指向 GetAllBookAPI.vue 页面
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  const db = getFirestore();

  const requiresAuth = to.meta.requiresAuth;
  const requiredRoles = to.meta.requiredRoles || [];

  let currentUser = auth.currentUser;

  // 如果当前用户未知，并且路由需要认证，等待认证状态解析
  if (!currentUser && requiresAuth) {
    await new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        currentUser = user;
        unsubscribe();
        resolve();
      });
    });
  }

  const isAuthenticated = !!currentUser;

  // 情况1: 路由需要认证，但用户未登录
  if (requiresAuth && !isAuthenticated) {
    console.log('Navigation Guard: Access denied (authentication required).');
    next('/FireLogin');
    return;
  }

  // 情况2: 用户已登录，但尝试访问登录/注册页面
  if ((to.name === 'FireLogin' || to.name === 'FireRegister' || to.name === 'Login') && isAuthenticated) {
    console.log('Navigation Guard: Already logged in, redirecting from auth page.');
    next('/');
    return;
  }

  // 情况3: 路由需要特定角色，且用户已登录
  if (requiredRoles.length > 0 && isAuthenticated) {
    let userRole = null;
    if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            userRole = userDocSnap.data().role;
        } else {
            userRole = 'none'; // 视为无权限
        }
    } else {
        userRole = 'none';
    }

    if (requiredRoles.includes(userRole)) {
        next();
    } else {
        console.log(`Navigation Guard: Access denied (insufficient role: ${userRole}).`);
        next('/access-denied');
    }
    return;
  }

  // 其他情况，允许导航
  next();
});

export default router;