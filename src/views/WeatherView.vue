<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
        />
        <button @click="searchByCity" class="search-button">
          Search
        </button>
        <br /><br />
      </div>
    </div>

    <main>
      <div v-if="weatherData">
        <h2>
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
      <div v-if="loading" class="text-center text-info mt-3">Loading weather...</div>
      <div v-if="error" class="text-center text-danger mt-3">{{ error }}</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // 导入 ref, computed, onMounted
import axios from 'axios'; // <-- 导入 axios

//  OpenWeatherMap 获取的 API 密钥
const API_KEY = "08f9f37e3e9e4e04657cfdbfb558257e"; //  API 密钥 

const city = ref(''); // 用于绑定城市输入框
const weatherData = ref(null); // 用于存储从 API 获取的原始天气数据
const loading = ref(false); // 加载状态
const error = ref(null);    // 错误信息

// Computed 属性：计算摄氏温度
const temperature = computed(() => {
  if (weatherData.value && weatherData.value.main && weatherData.value.main.temp) {
    // OpenWeatherMap 默认返回开尔文温度，转换为摄氏度需要减去 273.15
    // 或者，如果 API 请求时使用了 units=metric，则直接返回摄氏度，无需转换
    // 假设我们会在 API 请求中加入 units=metric
    return Math.floor(weatherData.value.main.temp); // 四舍五入取整
  }
  return null;
});

// Computed 属性：获取天气图标的 URL
const iconUrl = computed(() => {
  if (weatherData.value && weatherData.value.weather && weatherData.value.weather[0]) {
    const iconCode = weatherData.value.weather[0].icon;
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }
  return null;
});

// 核心函数：根据 URL 获取天气数据
const fetchWeatherData = async (url) => {
  loading.value = true;
  error.value = null;
  weatherData.value = null; // 清空旧数据

  try {
    const response = await axios.get(url);
    weatherData.value = response.data; // 将返回的数据存储到 weatherData
    console.log('Weather data fetched:', weatherData.value); // 打印数据以便调试
  } catch (err) {
    console.error("Error fetching weather data:", err);
    if (err.response) {
      // API 返回错误 (例如 404 Not Found, 401 Unauthorized)
      if (err.response.status === 404) {
        error.value = 'City not found. Please enter a valid city name.';
      } else if (err.response.status === 401) {
        error.value = 'API key invalid or not activated. Please check your key.';
      } else {
        error.value = `Error: ${err.response.status} - ${err.response.statusText}`;
      }
    } else if (err.request) {
      // 请求已发出但未收到响应
      error.value = 'No response from server. Check your internet connection.';
    } else {
      // 发送请求时发生错误
      error.value = `Request setup error: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
};

// 1. 实现“搜索天气按城市”功能
const searchByCity = () => {
  if (!city.value) {
    error.value = 'Please enter a city name.';
    return;
  }
  // OpenWeatherMap API 链接：按城市名称查询，并指定单位为摄氏度 (metric)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${API_KEY}&units=metric`;
  fetchWeatherData(url);
};

// 2. 实现“获取当前位置天气”功能（在页面加载时调用）
const fetchCurrentLocationWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      // OpenWeatherMap API 链接：按经纬度查询，并指定单位为摄氏度 (metric)
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      await fetchWeatherData(url);
    }, (geoError) => {
      // 处理地理位置获取错误
      console.error("Geolocation error:", geoError);
      error.value = "Unable to retrieve your location. Please allow location access or search by city.";
    });
  } else {
    error.value = "Geolocation is not supported by your browser.";
  }
};

// 在组件挂载时自动获取当前位置天气
onMounted(fetchCurrentLocationWeather);
</script>



<!-- <template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      </div>

    <main>
      <div v-if="weatherData">
        <h2>
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
      <div v-if="loading" class="text-center text-info mt-3">Loading current location weather...</div>
      <div v-if="error" class="text-center text-danger mt-3">{{ error }}</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 从 OpenWeatherMap 获取的 API 密钥
const API_KEY = "08f9f37e3e9e4e04657cfdbfb558257e"; 

const weatherData = ref(null);
const loading = ref(false);
const error = ref(null);

// Computed 属性：计算摄氏温度
const temperature = computed(() => {
  if (weatherData.value && weatherData.value.main && weatherData.value.main.temp) {
    return Math.floor(weatherData.value.main.temp);
  }
  return null;
});

// Computed 属性：获取天气图标的 URL
const iconUrl = computed(() => {
  if (weatherData.value && weatherData.value.weather && weatherData.value.weather[0]) {
    const iconCode = weatherData.value.weather[0].icon;
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }
  return null;
});

// 核心函数：根据 URL 获取天气数据
const fetchWeatherData = async (url) => {
  loading.value = true;
  error.value = null;
  weatherData.value = null;

  try {
    const response = await axios.get(url);
    weatherData.value = response.data;
    console.log('Weather data fetched:', weatherData.value);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    if (err.response) {
      if (err.response.status === 404) {
        error.value = 'City not found (this should not happen for current location).'; // 修改错误信息
      } else if (err.response.status === 401) {
        error.value = 'API key invalid or not activated. Please check your key.';
      } else {
        error.value = `Error: ${err.response.status} - ${err.response.statusText}.`;
      }
    } else if (err.request) {
      error.value = 'No response from server. Check your internet connection.';
    } else {
      error.value = `Request setup error: ${err.message}.`;
    }
  } finally {
    loading.value = false;
  }
};


const fetchCurrentLocationWeather = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      await fetchWeatherData(url);
    }, (geoError) => {
      console.error("Geolocation error:", geoError);
      error.value = "Unable to retrieve your location. Please allow location access.";
    });
  } else {
    error.value = "Geolocation is not supported by your browser.";
  }
};

// 在组件挂载时自动获取当前位置天气
onMounted(fetchCurrentLocationWeather);
</script> -->

<style scoped>

.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
.header h1 {
  text-align: center;
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}
.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  width: 70%;
}
.search-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
main {
  text-align: center;
}
main h2 {
  margin-bottom: 10px;
}
main img {
  width: 80px; /* 调整图标大小 */
  height: 80px;
}
main p {
  font-size: 2.5rem; /* 调整温度字体大小 */
  font-weight: bold;
  margin: 10px 0;
}
main span {
  font-size: 1.2rem;
  text-transform: capitalize; /* 首字母大写 */
}
</style>