<template>
  <div class="api-container">
    <h2 class="text-center mb-4">All Books API Data (JSON Format)</h2>
    <div v-if="loading" class="text-center text-info">Loading books data...</div>
    <div v-if="error" class="text-center text-danger">{{ error }}</div>
    <div v-if="apiResponse" class="api-response card p-3">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
    <div v-else-if="!loading && !error" class="text-center text-muted">No book data available.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js'; // 导入 db 实例
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // 导入 Firestore 查询函数

const apiResponse = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchAllBooks = async () => {
  loading.value = true;
  error.value = null;
  apiResponse.value = null;

  try {
    // 从 'books' 集合中获取所有文档，并按创建时间排序
    const q = query(collection(db, "books"), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const booksData = [];
    querySnapshot.forEach((doc) => {
      // 将文档数据和 ID 添加到数组中
      booksData.push({ id: doc.id, ...doc.data() });
    });

    // 构建 API 响应结构
    apiResponse.value = {
      success: true,
      data: {
        totalBooks: booksData.length,
        books: booksData
      },
      timestamp: new Date().toISOString()
    };
    console.log("All books API data:", apiResponse.value);

  } catch (e) {
    console.error("Error fetching all books API data: ", e);
    error.value = "Failed to load book API data. Please try again.";
  } finally {
    loading.value = false;
  }
};

// 在组件挂载时调用 fetchAllBooks
onMounted(fetchAllBooks);
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
  text-align: left; /* 确保 JSON 从左侧开始对齐 */
  max-height: 600px; /* 限制高度，增加滚动条 */
  overflow-y: auto;
}
</style>