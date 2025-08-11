<template>
  <div class="firebase-auth-container">
    <h2 class="text-center mb-4">Sign in via Firebase</h2>
    <form @submit.prevent="signin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="email" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Sign In</button>
      <div v-if="loginError" class="text-danger mt-3 text-center">{{ loginError }}</div>
      <p class="mt-3 text-center">
        Don't have an account? <router-link to="/FireRegister">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const email = ref('');
const password = ref('');
const loginError = ref(null);
const router = useRouter();

const auth = getAuth();
const db = getFirestore();

const signin = async () => { // <-- 添加 async
  loginError.value = null;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value); // <-- 使用 await
    console.log('Firebase Login Successful!', userCredential.user);
    console.log('Current User:', auth.currentUser);

    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid); // 指向 Firestore 中的用户文档
    const userDocSnap = await getDoc(userDocRef); // <-- 使用 await 获取文档快照

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log('User Role from Firestore:', userData.role);
      localStorage.setItem('firebaseUserRole', userData.role); // <-- 存储用户角色到 localStorage
    } else {
      console.warn('User data not found in Firestore for UID:', user.uid);
      localStorage.setItem('firebaseUserRole', 'unknown'); // 如果 Firestore 中没有，给个默认值
    }

    localStorage.setItem('firebaseIsAuthenticated', 'true'); // 设置认证状态
    router.push('/'); // 登录成功后重定向到主页

  } catch (error) { // <-- 捕获错误
    console.error('Firebase Login Error:', error.code, error.message);
    switch (error.code) {
      case 'auth/user-not-found':
        loginError.value = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        loginError.value = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        loginError.value = 'Invalid email address.';
        break;
      default:
        loginError.value = 'Login failed. Please check your credentials.';
    }
  }
};
</script>

<style scoped>
.firebase-auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
</style>