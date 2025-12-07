<template>
  <nav class="navbar">
    <!-- LEFT SECTION -->
    <div class="left-section">
      <img
        src="https://img.icons8.com/ios-filled/50/6c3bff/globe.png"
        class="logo-icon"
        alt="logo"
      />
      <h1 class="logo-text">connectSphere</h1>
    </div>

    <!-- SEARCH -->
    <div class="search-box">
      <input type="text" placeholder="Search for other users" />
      <span class="search-icon">🔍</span>
    </div>

    <!-- BURGER ICON (MOBILE) -->
    <div class="burger" @click="isOpen = !isOpen">☰</div>

    <!-- RIGHT SECTION -->
    <div class="right-section" :class="{ open: isOpen }">
      <router-link
        class="create-btn"
        :to="{ path: '/createPost' }"
        v-if="user.token"
      >
        Create Post
      </router-link>

      <router-link class="home fw-bold" :to="{ path: '/' }">Home</router-link>
      <router-link
        class="register fw-bold"
        :to="{ path: '/register' }"
        v-if="!user.token"
        >Register</router-link
      >
      <router-link
        class="logout fw-bold"
        :to="{ path: '/login' }"
        v-if="!user.token"
        >Login</router-link
      >
      <router-link
        class="login fw-bold"
        :to="{ path: '/logout' }"
        v-if="user.token"
        >Logout</router-link
      >
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalStore } from "../stores/global";
const { user } = useGlobalStore();

const isOpen = ref(false);
</script>




<style scoped>
.navbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 25px;
  background: white;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

/* LEFT SECTION */
.left-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 35px;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  color: #6c3bff;
}

/* SEARCH */
.search-box {
  position: relative;
  width: 380px;
}

.search-box input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border-radius: 25px;
  border: none;
  background: #f1eef9;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #444;
  cursor: pointer;
}

/* RIGHT SECTION */
.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* BUTTON */
.create-btn {
  background: #2765ff;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
}

.create-btn:hover {
  background: #1e54d8;
}

/* PROFILE PIC */
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* BURGER ICON (HIDDEN ON DESKTOP) */
.burger {
  display: none;
  font-size: 26px;
  cursor: pointer;
}

/* ----------------------- */
/*     MID-SIZE VIEW       */
/* ----------------------- */

@media (max-width: 1024px) {
  /* Make logo text smaller */
  .logo-text {
    font-size: 18px;
  }

  /* Reduce search box width */
  .search-box {
    width: 150px;
  }

  /* Shrink buttons slightly */
  .create-btn {
    padding: 8px 14px;
    font-size: 14px;
  }

  /* Reduce spacing */
  .right-section {
    gap: 14px;
  }
}

a {
  text-decoration: none;
}

/* ----------------------- */
/*       MOBILE VIEW        */
/* ----------------------- */

@media (max-width: 768px) {
  /* Hide logo text */
  .logo-text {
    display: none;
  }

  /* Make search bar smaller */
  .search-box {
    width: 150px;
  }

  /* Show burger menu */
  .burger {
    display: block;
  }

  /* Right section dropdown */
  .right-section {
    position: absolute;
    top: 70px;
    right: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-top: 1px solid #eee;
    display: none;
  }

  /* Open dropdown */
  .right-section.open {
    display: flex;
  }
}
</style>
