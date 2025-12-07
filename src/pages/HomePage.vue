<template>
  <!-- ////////////////// Homepage -->
  <div v-if="!store.user.token" class="home-container">
    <!-- HEADER / LOGO -->
    <header class="header mt-5">
      <div class="logo">
        <img
          src="https://img.icons8.com/ios-filled/50/6c3bff/globe.png"
          alt="connectSphere Logo"
          class="logo-img"
        />
        <h1 class="title">connectSphere</h1>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="hero">
      <h2 class="hero-title mt-5">Welcome to connectSphere</h2>
      <p class="hero-subtitle mb-5">
        A place where ideas connect, stories unfold, and communities grow. Join
        a global sphere of creators, thinkers, and explorers.
      </p>

      <router-link class="explore-btn" :to="{ path: '/login' }"
        >Explore Now</router-link
      >
    </section>

    <!-- FEATURE SECTION -->
    <section class="features mt-5">
      <div class="feature-card">
        <h3>🌍 Connect</h3>
        <p>
          Meet people across the world, share your thoughts, and build
          meaningful connections.
        </p>
      </div>

      <div class="feature-card">
        <h3>✏️ Create</h3>
        <p>
          Write blogs, share posts, tell your story—your voice matters here.
        </p>
      </div>

      <div class="feature-card">
        <h3>📣 Engage</h3>
        <p>
          Discuss topics you care about and take part in a vibrant online
          community.
        </p>
      </div>
    </section>
  </div>
  <!-- ////////////////// -->

  <div v-else class="homepage-container">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="user-section">
        <!-- <div class="avatar">
          {{ store.user.userName?.charAt(0).toUpperCase() }}
        </div> -->

        <h2 class="username text-light">{{ store.user.userName }}</h2>
        <p class="role">{{ store.user.isAdmin ? "Admin" : "User" }}</p>
      </div>

      <nav class="menu">
        <button :to="{ name: 'Home' }">🏠 Home</button>
        <button @click="goToPostRoute('CreatePost')">➕ Add Post</button>
        <!-- <button @click="goTo('EditProfile')">✏️ Edit Profile</button> -->
        <!-- <button @click="goTo('Profile')">👤 Profile</button> -->
        <!-- <button @click="goTo('ChangePassword')">🔑 Change Password</button> -->
      </nav>

      <button class="create-post-btn" @click="goTo('AddPost')">
        Create Post
      </button>
    </aside>

    <!-- MAIN CONTENT: POSTS -->
    <main class="feed">
      <h2 class="feed-title">Posts</h2>

      <div v-if="loadingPosts">Loading posts...</div>

      <div v-else v-for="post in posts" :key="post._id" class="post-card">
        <!-- Header -->
        <div class="post-header">
          <div class="author-circle">
            {{ post.author.charAt(0).toUpperCase() }}
          </div>

          <div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-author">by {{ post.author }}</p>
          </div>
        </div>

        <!-- Body -->
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>

        <!-- Comments Section -->
        <div class="post-comments" v-if="post.comments && post.comments.length">
          <h4 class="comment-title">💬 Comments</h4>

          <ul class="comment-list">
            <li
              v-for="(c, idx) in post.comments"
              :key="idx"
              class="comment-item"
            >
              <div class="comment-header">
                <span class="comment-author">{{ c.author }}</span>
              </div>
              <p class="comment-text">{{ c.comment }}</p>
            </li>
          </ul>
        </div>
        <!-- View Post Button -->
        <button class="view-post-btn" @click="goToPost(post._id)">
          🔍 View Post
        </button>
      </div>
    </main>

    <!-- RIGHT SIDEBAR: USER SUGGESTIONS -->
    <aside class="suggestions">
      <h3 class="suggest-title">✨ User Suggestions</h3>

      <div v-if="loadingUsers" class="loading">Loading suggestions...</div>

      <div
        v-else
        v-for="person in randomSuggestions"
        :key="person._id"
        class="suggest-item"
      >
        <div class="avatar-icon">
          {{ person.userName?.charAt(0).toUpperCase() }}
        </div>

        <div class="suggest-info">
          <h4 class="suggest-name">{{ person.userName }}</h4>
          <p class="subtitle">{{ person.email || "No description" }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../api.js";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global.js";

const router = useRouter();
const store = useGlobalStore();

/* BLOG POSTS */
const posts = ref([]);
const loadingPosts = ref(true);

/* USERS (SUGGESTIONS) */
const allUsers = ref([]);
const loadingUsers = ref(true);

/* ---- FETCH ALL BLOGS ---- */
async function loadPosts() {
  try {
    const res = await api.get("/blog/getAllBlogs");
    posts.value = res.data.allBlogs;
  } catch (err) {
    console.error(err);
  } finally {
    loadingPosts.value = false;
  }
}

/* ---- FETCH ALL USERS (ADMIN ROUTE) ---- */
async function loadUsers() {
  try {
    const res = await api.get("users/allUser"); // requires admin
    allUsers.value = res.data.allUser;
  } catch (err) {
    console.error(err);
  } finally {
    loadingUsers.value = false;
  }
}
onMounted(() => {
  loadPosts(); // works
  if (store.user.token) {
    loadUsers();
  }
});

/* ---- PICK RANDOM 3 USERS ---- */
const randomSuggestions = computed(() => {
  if (!allUsers.value.length) return [];

  return [...allUsers.value].sort(() => Math.random() - 0.5).slice(0, 3);
});

/* ---- NAVIGATION ---- */
function goTo(name) {
  try {
    router.push({ path: "/createPost" });
  } catch (e) {
    console.warn("Route not found:", name);
  }
}

function goToPostRoute(name) {
  try {
    router.push({ path: name });
  } catch (e) {
    console.warn("Route not found:", name);
  }
}

function goToPost(id) {
  router.push(`/view-post/${id}`);
}

/* ---- LOAD EVERYTHING ---- */
onMounted(() => {
  loadPosts();
  loadUsers();
});
</script>

<style scoped>
.view-post-btn {
  margin-top: 15px;
  padding: 12px 22px;
  background: linear-gradient(135deg, #7f00ff, #e100ff);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(127, 0, 255, 0.35);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.view-post-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  transition: 0.3s ease;
}

.view-post-btn:hover::before {
  left: 0;
}

.view-post-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 26px rgba(127, 0, 255, 0.5);
}

.view-post-btn:active {
  transform: scale(0.97);
}
/* ================================
   PAGE LAYOUT
================================ */
.homepage-container {
  display: flex;
  gap: 20px;
  padding: 25px;
  background: #f5e6e6;
}

/* ================================
   LEFT SIDEBAR
================================ */
.sidebar {
  width: 240px;
  background: linear-gradient(160deg, #6e29d3, #a855f7);
  padding: 22px;
  border-radius: 18px;
  height: fit-content;
  box-shadow: 0 10px 30px rgba(110, 41, 211, 0.25);
  transition: 0.3s ease;
}

.user-section {
  text-align: center;
  margin-bottom: 25px;
  padding: 20px 10px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.username {
  font-size: 20px;
  font-weight: bold;
}

.role {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 6px 14px;
  border-radius: 999px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.menu button {
  display: block;
  width: 100%;
  padding: 12px;
  text-align: left;
  font-size: 15px;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 5px;
  border-radius: 8px;
}

.menu button:hover {
  background: #f0f0ff;
}

.create-post-btn {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  font-size: 16px;
  color: white;
  background: #4b6cff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

/* ================================
   FEED MAIN CONTENT
================================ */
.feed {
  flex: 1;
}

.feed-title {
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #444;
}

/* ================================
   POST CARD (NEW CREATIVE DESIGN)
================================ */
.post-card {
  background: #ffffff;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  transition: 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
}

/* ---------------- Header ---------------- */
.post-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.author-circle {
  width: 45px;
  height: 45px;
  background: #6e29d3;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
}

.post-title {
  font-size: 20px;
  margin: 0;
}

.post-author {
  font-size: 13px;
  color: #777;
}

/* ---------------- Content ---------------- */
.post-content {
  background: #f9f6ff;
  padding: 18px;
  border-radius: 12px;
  margin-top: 10px;
  border-left: 5px solid #6e29d3;
  font-size: 15px;
}

/* ================================
   COMMENTS SECTION (NEW STYLE)
================================ */
.post-comments {
  margin-top: 20px;
  padding: 15px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #eee;
}

.comment-title {
  font-size: 17px;
  margin-bottom: 12px;
  font-weight: bold;
  color: #6e29d3;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-item {
  background: white;
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-left: 4px solid #6e29d3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.comment-author {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.comment-text {
  color: #555;
  margin-top: 3px;
  font-size: 14px;
}

/* ================================
   RIGHT SIDEBAR (USER SUGGESTIONS)
================================ */
.suggestions {
  width: 260px;
  background: white;
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(110, 41, 211, 0.15);
  height: fit-content;
  text-align: center;
}

.suggest-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #6e29d3;
  letter-spacing: 0.3px;
}

.suggest-item {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 15px;
  padding: 14px;
  background: #f7f3ff;
  border-radius: 16px;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);
}

.suggest-item:hover {
  background: #eee6ff;
  transform: translateY(-2px);
}

.avatar-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6e29d3, #a855f7);
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 12px rgba(110, 41, 211, 0.25);
}

.subtitle {
  font-size: 13px;
  color: gray;
}

/* ================================
   RESPONSIVE DESIGN
================================ */
@media (max-width: 900px) {
  .homepage-container {
    flex-direction: column;
  }

  .sidebar,
  .suggestions {
    width: 100%;
  }

  .feed {
    width: 100%;
  }
}

/* //////////////////  */
.home-container {
  font-family: "Inter", sans-serif;
  color: #3a3a3a;
}

/* HEADER / LOGO */
.header {
  display: flex;
  justify-content: center;
  padding: 25px 0;
  background: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 45px;
  height: 45px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #7a4dff;
}

/* HERO SECTION */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #7a4dff, #9d67ff);
  color: white;
}

.hero-title {
  font-size: 2.6rem;
  font-weight: 800;
  margin-bottom: 15px;
  animation: fadeInDown 1s ease forwards;
}

.hero-subtitle {
  max-width: 600px;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 1.5;
  animation: fadeIn 1.4s ease forwards;
}

.explore-btn {
  margin-top: 50px;
  padding: 12px 28px;
  background-color: white;
  color: #7a4dff;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  animation: fadeInUp 1.4s ease forwards;
  margin-bottom: 50px;
}

.explore-btn:hover {
  background-color: #f2eaff;
}

/* FEATURES */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  padding: 50px 20px;
  background: #faf8ff;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-card h3 {
  color: #7a4dff;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

a {
  text-decoration: none;
}

/* //////////////////  */

.suggest-info {
  text-align: left;
}

.suggest-name {
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.subtitle {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}

/* LOADING TEXT */
.loading {
  font-size: 14px;
  color: #777;
}
@media (max-width: 376px) {
  .sidebar {
    margin-top: 100px;
  }
}
</style>

