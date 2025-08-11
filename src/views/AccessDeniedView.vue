<template>
  <div class="access-denied-container">
    <h1 class="text-danger">Access Denied!</h1>
    <p>You do not have permission to view this page. Please log in.</p>
    <button @click="goToLogin" class="btn btn-primary">Go to Login</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login'); // 导航到登录页面
};
</script>

<style scoped>
.access-denied-container {
  text-align: center;
  margin: 100px auto;
  padding: 30px;
  border: 1px solid #ffdddd;
  border-radius: 8px;
  background-color: #fffafa;
  color: #d8000c;
  max-width: 600px;
}
</style>