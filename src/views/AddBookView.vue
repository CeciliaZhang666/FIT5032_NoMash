<!-- <template>
  <div class="add-book-container">
    <h2 class="text-center mb-4">Add New Book</h2>
    <form @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input type="number" class="form-control" id="isbn" v-model.number="book.isbn" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Book Name</label>
        <input type="text" class="form-control" id="name" v-model="book.name" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Add Book</button>
      <div v-if="successMessage" class="text-success mt-3 text-center">{{ successMessage }}</div>
      <div v-if="errorMessage" class="text-danger mt-3 text-center">{{ errorMessage }}</div>
    </form>

    <BookList /> </div>
</template>

<script setup>
import { ref } from 'vue';
import db from '../firebase/init.js'; // 导入 db 实例
import { collection, addDoc } from 'firebase/firestore'; // 导入 Firestore 函数
import BookList from '../components/BookList.vue'; // <-- 确保导入 BookList 组件

// 定义 isbn 和 name 的引用
const book = ref({
  isbn: null,
  name: ''
});

const successMessage = ref(null);
const errorMessage = ref(null);

const addBook = async () => {
  successMessage.value = null;
  errorMessage.value = null;

  if (!book.value.isbn || !book.value.name) {
    errorMessage.value = 'Both ISBN and Book Name are required.';
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "books"), {
      isbn: book.value.isbn,
      name: book.value.name,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    successMessage.value = `Book "${book.value.name}" added successfully with ID: ${docRef.id}`;

    // 清空表单
    book.value.isbn = null;
    book.value.name = '';

  } catch (e) {
    console.error("Error adding document: ", e);
    errorMessage.value = "Failed to add book. Please try again.";
  }
};
</script>

<style scoped>
.add-book-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
</style> -->

<template>
  <div class="add-book-container">
    <h2 class="text-center mb-4">Add New Book</h2>
    <form @submit.prevent="addBook">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN</label>
        <input type="number" class="form-control" id="isbn" v-model.number="book.isbn" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Book Name</label>
        <input type="text" class="form-control" id="name" v-model="book.name" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Add Book</button>
      <div v-if="successMessage" class="text-success mt-3 text-center">{{ successMessage }}</div>
      <div v-if="errorMessage" class="text-danger mt-3 text-center">{{ errorMessage }}</div>
    </form>

    <BookList /> 
  </div>
</template>

<script setup>
import { ref } from 'vue';
import db from '../firebase/init.js';
import { collection, addDoc } from 'firebase/firestore';
import BookList from '../components/BookList.vue';

const book = ref({
  isbn: null,
  name: ''
});

const successMessage = ref(null);
const errorMessage = ref(null);
// const bookListComponent = ref(null); // <-- 移除这一行，不再需要引用子组件

const addBook = async () => {
  successMessage.value = null;
  errorMessage.value = null;

  if (!book.value.isbn || !book.value.name) {
    errorMessage.value = 'Both ISBN and Book Name are required.';
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "books"), {
      isbn: book.value.isbn,
      name: book.value.name,
      createdAt: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    successMessage.value = `Book "${book.value.name}" added successfully with ID: ${docRef.id}`;
    
    // 清空表单
    book.value.isbn = null;
    book.value.name = '';

    // <-- 移除手动调用 BookList 组件的 fetchBooks 方法
    // if (bookListComponent.value) {
    //   bookListComponent.value.fetchBooks();
    // }

  } catch (e) {
    console.error("Error adding document: ", e);
    errorMessage.value = "Failed to add book. Please try again.";
  }
};
</script>

<style scoped>
.add-book-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}
</style>