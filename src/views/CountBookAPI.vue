<template>
  <div class="api-container">
    <h2 class="text-center mb-4">Book & Author API Data</h2>
    <div v-if="loading" class="text-center text-info">Loading API data...</div>
    <div v-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-if="apiResponse" class="api-response card p-3">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 导入 authors.json 文件
import authorsData from '@/assets/json/authors.json'; // 导入本地 JSON 文件

const authors = ref([]);
const loading = ref(false);
const error = ref(null);
const apiResponse = ref(null);
const authorsCount = ref(0);
const totalBooks = ref(0);

const calculateStats = () => {
  authorsCount.value = authors.value.length;
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + (author.famousworks ? author.famousworks.length : 0); // 确保 famousworks 存在
  }, 0);
};

const getApiData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 直接使用导入的 authorsData
    authors.value = authorsData;
    calculateStats();

    // 构建 API 响应结构
    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousworks ? author.famousworks.length : 0 // 确保 famousworks 存在
        }))
      },
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`;
    console.error('Error loading authors data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getApiData();
});
</script>

<style scoped>
.api-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
.api-response {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap; /* 保持换行和空格 */
}
</style>