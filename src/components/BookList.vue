<template>
  <div class="book-list-container mt-5">
    <h3 class="text-center mb-3">Books with ISBN > 1000 (with Edit/Delete)</h3>
    <div v-if="loading" class="text-center text-info">Loading books...</div>
    <div v-if="error" class="text-center text-danger">{{ error }}</div>
    <ul class="list-group" v-if="books.length">
      <li class="list-group-item d-flex justify-content-between align-items-center" v-for="book in books" :key="book.id">
        <div v-if="editingBook && editingBook.id === book.id" class="flex-grow-1 me-3">
          <input type="text" v-model="editName" class="form-control mb-2" placeholder="Book Name" />
          <input type="number" v-model.number="editIsbn" class="form-control" placeholder="ISBN" />
        </div>
        <div v-else class="flex-grow-1">
          <strong>{{ book.name }}</strong> - ISBN: {{ book.isbn }}
        </div>
        
        <div>
          <template v-if="editingBook && editingBook.id === book.id">
            <button @click="saveEdit" class="btn btn-success btn-sm me-2">Save</button>
            <button @click="cancelEdit" class="btn btn-secondary btn-sm">Cancel</button>
          </template>
          <template v-else>
            <button @click="startEdit(book)" class="btn btn-info btn-sm me-2">Edit</button>
            <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">Delete</button>
          </template>
        </div>
      </li>
    </ul>
    <div v-else-if="!loading && !error" class="text-center text-muted">No books found with ISBN > 1000.</div>
  
    <div class="book-list-container mt-5">
      <h3 class="text-center mb-3">Top 3 Books (ISBN > 1000, ordered by Name)</h3>
      <div v-if="loadingTopBooks" class="text-center text-info">Loading top books...</div>
      <div v-if="errorTopBooks" class="text-center text-danger">{{ errorTopBooks }}</div>
      <ul class="list-group" v-if="topBooks.length">
        <li class="list-group-item" v-for="book in topBooks" :key="book.id">
          <strong>{{ book.name }}</strong> - ISBN: {{ book.isbn }}
        </li>
      </ul>
      <div v-else-if="!loadingTopBooks && !errorTopBooks" class="text-center text-muted">No top books found.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';

const books = ref([]);
const loading = ref(true);
const error = ref(null);
const editingBook = ref(null);
const editName = ref('');
const editIsbn = ref(null);

// 用于组合查询
const topBooks = ref([]);
const loadingTopBooks = ref(true);
const errorTopBooks = ref(null);

// 调试计数器
let fetchBooksCallCount = 0;
let fetchTopBooksCallCount = 0;

const fetchBooks = async () => {
  fetchBooksCallCount++;
  console.log(`[BookList] fetchBooks called. Call count: ${fetchBooksCallCount}`);
  loading.value = true;
  error.value = null;
  books.value = []; // 每次获取前清空数组

  try {
    const q = query(collection(db, "books"), where("isbn", ">", 1000));
    const querySnapshot = await getDocs(q);

    const fetchedBookIds = new Set(); // 用于确保唯一性
    const newBooks = [];
    console.log(`[BookList] fetchBooks - querySnapshot size: ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      if (!fetchedBookIds.has(doc.id)) {
        const bookData = { id: doc.id, ...doc.data() };
        newBooks.push(bookData);
        fetchedBookIds.add(doc.id);
        console.log('[BookList] Adding doc to books array:', bookData);
      } else {
        console.warn('[BookList] Duplicate doc ID found during fetchBooks:', doc.id);
      }
    });
    books.value = newBooks; // 赋值新的唯一数组
    console.log("[BookList] Books array after fetchBooks:", books.value);
  } catch (e) {
    console.error("[BookList] Error fetching documents: ", e);
    error.value = "Failed to load books. Please try again.";
  } finally {
    loading.value = false;
  }
};

const deleteBook = async (bookId) => {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      await deleteDoc(doc(db, "books", bookId));
      console.log("Document successfully deleted!");
      // 从列表中移除被删除的书籍
      books.value = books.value.filter(book => book.id !== bookId);
      // 同时更新 topBooks 列表
      topBooks.value = topBooks.value.filter(book => book.id !== bookId);
    } catch (e) {
      console.error("Error removing document: ", e);
      error.value = "Failed to delete book. Please try again.";
    }
  }
};

const startEdit = (book) => {
  editingBook.value = { ...book };
  editName.value = book.name;
  editIsbn.value = book.isbn;
};

const saveEdit = async () => {
  if (!editingBook.value) return;

  try {
    const bookRef = doc(db, "books", editingBook.value.id);
    await updateDoc(bookRef, {
      name: editName.value,
      isbn: editIsbn.value
    });
    console.log("Document successfully updated!");

    // 更新本地书籍列表
    const index = books.value.findIndex(b => b.id === editingBook.value.id);
    if (index !== -1) {
      books.value[index].name = editName.value;
      books.value[index].isbn = editIsbn.value;
    }
    // 同时更新 topBooks 列表
    const topIndex = topBooks.value.findIndex(b => b.id === editingBook.value.id);
    if (topIndex !== -1) {
      topBooks.value[topIndex].name = editName.value;
      topBooks.value[topIndex].isbn = editIsbn.value;
    }

    editingBook.value = null; // 退出编辑模式
    // 重新获取数据以确保排序和限制正确（特别是对于 topBooks）
    fetchBooks();
    fetchTopBooks();
  } catch (e) {
    console.error("Error updating document: ", e);
    error.value = "Failed to update book. Please try again.";
  }
};

const cancelEdit = () => {
  editingBook.value = null;
};

const fetchTopBooks = async () => {
  fetchTopBooksCallCount++;
  console.log(`[BookList] fetchTopBooks called. Call count: ${fetchTopBooksCallCount}`);
  loadingTopBooks.value = true;
  errorTopBooks.value = null;
  topBooks.value = [];

  try {
    const q = query(
      collection(db, "books"),
      where("isbn", ">", 1000),
      orderBy("name", "asc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);

    const fetchedTopBookIds = new Set();
    const newTopBooks = [];
    console.log(`[BookList] fetchTopBooks - querySnapshot size: ${querySnapshot.size}`);
    querySnapshot.forEach((doc) => {
      if (!fetchedTopBookIds.has(doc.id)) {
        const bookData = { id: doc.id, ...doc.data() };
        newTopBooks.push(bookData);
        fetchedTopBookIds.add(doc.id);
        console.log('[BookList] Adding doc to topBooks array:', bookData);
      } else {
        console.warn('[BookList] Duplicate doc ID found during fetchTopBooks:', doc.id);
      }
    });
    topBooks.value = newTopBooks;
    console.log("[BookList] Top Books array after fetchTopBooks:", topBooks.value);
  } catch (e) {
    console.error("[BookList] Error fetching top documents: ", e);
    errorTopBooks.value = "Failed to load top books. Please try again.";
  } finally {
    loadingTopBooks.value = false;
  }
};

onMounted(() => {
  fetchBooks();
  fetchTopBooks();
});

// 移除 defineExpose，因为 AddBookView 不再手动调用其方法
// import { defineExpose } from 'vue';
// defineExpose({
//   fetchBooks
// });
</script>

<style scoped>
.book-list-container {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
</style>