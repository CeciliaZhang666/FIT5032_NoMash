<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills justify-content-center gap-3 w-100"> <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home (Week 5)</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        
        <li class="nav-item">
          <router-link to="/add-book" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Contact us</a>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link> 
        </li>
        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link> 
        </li>
        <li class="nav-item">
          <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Books API</router-link> 
        </li>
        <li class="nav-item"> <template v-if="!isAuthenticated">
            <div class="d-flex gap-2"> <router-link to="/FireLogin" class="nav-link">Firebase Login</router-link>
              <router-link to="/FireRegister" class="nav-link">Register</router-link>
            </div>
          </template>
          <template v-else>
            <a href="#" class="nav-link" @click.prevent="firebaseLogout">Logout ({{ currentUserEmail }})</a>
          </template>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue'; // 导入 computed 和 getCurrentInstance
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';

const router = useRouter();
const auth = getAuth();

// 获取全局认证状态
const { proxy } = getCurrentInstance(); // 获取当前组件实例
const authState = proxy.$authState; // 从全局属性访问 authState

// 使用 computed 属性从全局状态获取 isAuthenticated 和 currentUserEmail
const isAuthenticated = computed(() => authState.isAuthenticated);
const currentUserEmail = computed(() => authState.currentUser ? authState.currentUser.email : '');

const firebaseLogout = () => {
  console.log('Current user BEFORE Firebase Logout:', auth.currentUser);

  signOut(auth)
    .then(() => {
      console.log('Firebase Logout Successful!');
      router.push('/FireLogin'); // 强制重定向到登录页面
    })
    .catch((error) => {
      console.error('Firebase Logout Error:', error);
    });
};
</script>