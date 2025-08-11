<template>
  <div class="about-content"> <h1>About Our Library</h1>
    <p>Welcome to our digital library! We're dedicated to providing a vast collection of books and
      resources to our community. Our mission is to foster a love for reading and learning.</p>
  </div>
  <div class="add-book-container">
    </div>

  <BookList />
</template>

<script setup>
  import { ref } from 'vue';
  import db from '../firebase/init.js';
  import { collection, addDoc } from 'firebase/firestore';
  import BookList from '../components/BookList.vue'; // <-- 导入 BookList 组件
</script>

<style scoped>
/* 添加以下样式规则 */
.about-content {
  text-align: center; /* 居中所有内联内容（文本、图片等） */
  max-width: 800px; /* 设置一个最大宽度，防止文本在超宽屏幕上拉伸过长 */
  margin: 50px auto; /* 居中块级元素，并从顶部/底部添加一些边距 */
  padding: 20px; /* 添加一些内边距 */
}

/* 如果您想让标题和段落有更多间距，可以单独设置 */
.about-content h1 {
  margin-bottom: 20px;
}

.about-content p {
  line-height: 1.6; /* 增加行高以提高可读性 */
}
</style>