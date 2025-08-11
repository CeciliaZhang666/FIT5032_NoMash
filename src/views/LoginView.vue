<template>
  <div class="login-container">
    <h2 class="text-center mb-4">Login to Your Account</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" v-model="username" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
      <div v-if="loginError" class="text-danger mt-3 text-center">{{ loginError }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter

const username = ref('');
const password = ref('');
const loginError = ref(null); // 用于存储登录错误信息
const router = useRouter(); // 获取路由器实例

// 硬编码的凭据 (for this exercise) [cite: 564, 576]
const HARDCODED_USERNAME = 'test';
const HARDCODED_PASSWORD = 'password123';

const handleLogin = () => {
  loginError.value = null; // 每次尝试登录时清空错误

  if (username.value === HARDCODED_USERNAME && password.value === HARDCODED_PASSWORD) {
    // 登录成功
    // 存储认证状态 (例如，使用 localStorage 或一个全局响应式状态)
    localStorage.setItem('isAuthenticated', 'true');
    // 重定向到 Home 页面或之前尝试访问的页面
    router.push('/'); // 成功登录后导航到主页
  } else {
    // 登录失败
    loginError.value = 'Invalid username or password.';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
</style>