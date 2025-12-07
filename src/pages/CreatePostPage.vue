<template>
  <div class="create-post-container">
    <div class="card">
      <h2>Create New Blog</h2>

      <!-- Title Input -->
      <input
        type="text"
        v-model="title"
        placeholder="Enter blog title"
        class="input"
      />

      <!-- Content Input -->
      <textarea
        v-model="content"
        placeholder="Write your blog content..."
        class="textarea"
      ></textarea>

      <!-- Create Button -->
      <button class="btn" @click="submitPost" :disabled="loading">
        <span v-if="!loading" :to="{ path: '/createPost' }">Create Blog</span>
        <span v-else>Posting...</span>
      </button>

      <!-- Message -->
      <p class="msg" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../api.js";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global.js";

const { user } = useGlobalStore();

const router = useRouter();

const title = ref("");
const content = ref("");
const loading = ref(false);
const message = ref("");

async function submitPost() {
  if (!title.value || !content.value) {
    message.value = "Please fill in all fields.";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const res = await api.post("/blog/createBlog", {
      title: title.value,
      content: content.value,
    });

    message.value = "Blog created successfully! Redirecting...";
    setTimeout(() => router.push({ path: "/" }), 1200);
  } catch (err) {
    console.error(err);
    message.value = err.response?.data?.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ==== Layout Wrapper ==== */
.create-post-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  width: 100%;
}

/* ==== Card ==== */
.card {
  background: white;
  width: 100%;
  max-width: 600px;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card h2 {
  text-align: center;
  font-size: 25px;
  font-weight: 700;
  color: #444;
}

/* ==== Inputs ==== */
.input,
.textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 15px;
  transition: 0.2s;
}

.input:focus,
.textarea:focus {
  border-color: #6c63ff;
  background: #fff;
  outline: none;
}

/* Textarea */
.textarea {
  height: 170px;
  resize: none;
  line-height: 20px;
}

/* ==== Submit Button ==== */
.btn {
  padding: 12px;
  border: none;
  background: #6c63ff;
  color: white;
  font-size: 17px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
}

.btn:hover {
  background: #5750d8;
}

.btn:disabled {
  background: #a2a2a2;
  cursor: not-allowed;
}

/* ==== Message ==== */
.msg {
  text-align: center;
  font-size: 15px;
  color: #4d4d4d;
  padding-top: 5px;
}

/* ==== RESPONSIVE DESIGN ==== */

/* Mobile */
@media (max-width: 480px) {
  .card {
    padding: 18px;
    border-radius: 12px;
  }
  .card h2 {
    font-size: 20px;
  }
  .btn {
    font-size: 16px;
  }
}

/* Tablets */
@media (max-width: 768px) {
  .card {
    max-width: 500px;
  }
}
</style>
