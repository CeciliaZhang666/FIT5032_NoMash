<template>
  <div class="firebase-auth-container">
    <h2 class="text-center mb-4">Create an Account</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" placeholder="Email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" placeholder="Password" v-model="password" required />
      </div>
      <div class="mb-3">
        <label for="role" class="form-label">Select Role (for demo)</label>
        <select class="form-select" id="role" v-model="selectedRole">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary w-100">Register</button>
      <div v-if="registrationError" class="text-danger mt-3 text-center">{{ registrationError }}</div>
      <p class="mt-3 text-center">
        Already have an account? <router-link to="/FireLogin">Sign in here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // 导入 Firestore 函数

const email = ref("");
const password = ref("");
const selectedRole = ref('user'); // 默认角色为 'user'
const registrationError = ref(null);
const router = useRouter();

const auth = getAuth();
const db = getFirestore(); // 获取 Firestore 实例

const register = async () => { // 修改为 async 函数
  registrationError.value = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("Firebase Register Successful!", userCredential.user);

    const user = userCredential.user;
    const userId = user.uid;

    // 将用户数据（包括角色）保存到 Firestore
    await setDoc(doc(db, "users", userId), {
      email: user.email,
      role: selectedRole.value, // 使用选择的角色
      createdAt: new Date()
    });

    console.log('User data saved to Firestore with role:', selectedRole.value);
    router.push("/FireLogin"); // 注册成功后重定向到 Firebase 登录页面
  } catch (error) {
    console.error("Firebase Registration Error:", error.code, error.message);
    switch (error.code) {
      case 'auth/email-already-in-use':
        registrationError.value = 'This email is already registered.';
        break;
      case 'auth/invalid-email':
        registrationError.value = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        registrationError.value = 'Password should be at least 6 characters.';
        break;
      default:
        registrationError.value = 'Registration failed. Please try again.';
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