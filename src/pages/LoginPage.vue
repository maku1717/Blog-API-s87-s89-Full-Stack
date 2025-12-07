<template>
  <div class="container">
    <!-- LEFT SIDE (LOGIN FORM) -->
    <div class="left">
      <h2>Sign in</h2>

      <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Username" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />

        <button
          type="submit"
          class="signin-btn"
          :class="isEnabled ? 'btn-purple' : 'btn-gray'"
          :disabled="!isEnabled"
        >
          Sign In
        </button>
      </form>
    </div>

    <!-- RIGHT SIDE -->
    <div class="right">
      <h2>Not a User?</h2>
      <p>Enter your personal details to Sign Up</p>

      <button class="signup-btn" @click="goToSignup">Sign Up</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global.js";
import { Notyf } from "notyf";
import api from "../api";

const router = useRouter();
const notyf = new Notyf();
const store = useGlobalStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);

watch([email, password], (current) => {
  isEnabled.value = current.every((v) => v !== "");
});

async function handleLogin(e) {
  e.preventDefault();

  try {
    let res = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (res.data.message === "User logged in successfully") {
      notyf.success("Login successful");
      localStorage.setItem("token", res.data.access);
      await store.getUserDetails(res.data.access);

      email.value = "";
      password.value = "";

      if (store.user.isAdmin) {
        return router.push({ path: "/" });
      }

      router.push({ path: "/" });
    }
  } catch (err) {
    if (err.response) {
      notyf.error(err.response.data.message);
    } else {
      notyf.error("Login failed. Please try again.");
    }
  }
}

const goToSignup = () => {
  router.push({ path: "/register" });
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.container {
  width: 750px;
  height: 400px;
  background: white;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin: 50px auto;
}

/* LEFT SECTION */
.left {
  flex: 1;
  background: #ffffff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left h2 {
  color: #6a5acd;
  text-align: center;
  margin-bottom: 25px;
  font-size: 28px;
}

.left input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  background: #efefef;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

/* BUTTON STYLE */
.signin-btn {
  margin-top: 20px;
  padding: 12px;
  width: 150px;
  align-self: center;
  background: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.btn-gray {
  background: #c7c7c7 !important;
  cursor: not-allowed;
}

.btn-purple:hover {
  background: #5a4ac7;
}

/* RIGHT SECTION */
.right {
  flex: 1;
  padding: 40px;
  text-align: center;
  color: white;
  background: linear-gradient(to right, #4b6cff, #9352d8);
}

.right h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.right p {
  font-size: 14px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.signup-btn {
  padding: 10px 35px;
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.signup-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ===================================================
   RESPONSIVE STYLES (PHONES & SMALL DEVICES)
   =================================================== */

@media (max-width: 768px) {
  .container {
    width: 95%;
    height: auto;
    flex-direction: column; /* Stack left + right */
    margin: 20px auto;
  }

  .left,
  .right {
    flex: none;
    width: 100%;
    padding: 25px;
    text-align: center;
  }

  .left h2,
  .right h2 {
    font-size: 24px;
  }

  .left input {
    font-size: 16px;
    padding: 14px;
  }

  .signin-btn,
  .signup-btn {
    width: 100%; /* Full-width buttons for mobile */
    padding: 14px;
    font-size: 16px;
    display: block;
    margin: 20px auto 0;
  }

  /* Move the right section ABOVE login on phone */
  .right {
    order: -1;
    border-radius: 0;
  }
}

/* Extra small devices (350px – 450px) */
@media (max-width: 450px) {
  .container {
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .left,
  .right {
    padding: 20px;
  }

  .left h2,
  .right h2 {
    font-size: 22px;
  }

  .signin-btn,
  .signup-btn {
    font-size: 15px;
  }
}

@media (max-width: 376px) {
  .container {
    margin-top: 100px;
  }
}
</style>
