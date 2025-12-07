<template>
  <div class="container">
    <div class="left">
      <h2 class="">Sign Up</h2>

      <form @submit.prevent="handleSubmit">
        <input type="text" placeholder="Username" v-model="username" />
        <input type="email" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />

        <button
          type="submit"
          class="signup-btn"
          :class="isEnabled ? 'btn-brown' : 'btn-gray'"
          :disabled="!isEnabled"
        >
          Sign Up
        </button>
      </form>
    </div>

    <div class="right">
      <h2>Already a User?</h2>
      <p>Enter your personal details to Sign In</p>

      <button class="login-btn" @click="goToLogin">Login</button>
    </div>
  </div>
</template>


<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";
import api from "../api";

const { user } = useGlobalStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isEnabled = ref(false);

const notyf = new Notyf();

watch(
  [username, email, password, confirmPassword],
  (currentValue, oldValue) => {
    if (
      currentValue.every((input) => input !== "") &&
      currentValue[2] === currentValue[3]
    ) {
      isEnabled.value = true;
    } else {
      isEnabled.value = false;
    }
  }
);

async function handleSubmit(e) {
  e.preventDefault();
  try {
    let res = await api.post("/users/register", {
      email: email.value,
      userName: username.value,
      password: password.value,
    });

    if (res.data.message === "Registered successfully") {
      notyf.success("Registered successfully");

      (email.value = ""),
        (username.value = ""),
        (password.value = ""),
        (confirmPassword.value = ""),
        router.push({ path: "/login" });
    }
  } catch (err) {
    // Check first if the error has a response (server replied)
    if (err.response) {
      if (
        err.response.status === 404 ||
        err.response.status === 401 ||
        err.response.status === 400
      ) {
        notyf.error(err.response.data.message);
      } else {
        notyf.error("Registration failed. Please contact administrator");
      }
    } else if (err.request) {
      // Request was sent but no response from server
      notyf.error("No response from server. Please check your connection.");
    } else {
      // Something else went wrong setting up the request
      console.log("unexpected error");
    }
  }
}

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  height: 100vh; /* full screen height */
  display: flex;
  justify-content: center; /* centers left-right */
  align-items: center; /* centers top-bottom */
  background: #f2f2f2;
  margin: 0;
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
  margin: 8px 0;
  border: none;
  background: #efefef;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.signup-btn {
  margin-top: 15px;
  padding: 12px;
  background: #6a5acd;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.signup-btn:hover {
  background: #5a4ac7;
}

/* RIGHT SECTION */
.right {
  flex: 1;
  padding: 40px;
  text-align: center;
  color: white;
  background: linear-gradient(to right, #5a4ac7, #7b5bde);
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

.login-btn {
  padding: 10px 35px;
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-gray {
  background: #ccc !important;
  cursor: not-allowed;
}

.btn-brown {
  background: #6a5acd !important;
}

.signup-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* ================================
   RESPONSIVE (PHONES / SMALL SCREENS)
================================ */
@media (max-width: 768px) {
  .container {
    width: 95%;
    height: auto;
    flex-direction: column; /* stack columns */
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

  .signup-btn,
  .login-btn {
    width: 100%;
    padding: 14px;
    font-size: 16px;
  }

  /* Adjust right panel */
  .right {
    order: -1; /* Move login section ABOVE Sign Up on mobile */
    border-radius: 0;
  }
}

/* Extra small screens (like 350px–400px) */
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
}

@media (max-width: 376px) {
  .container {
    margin-top: 100px;
  }
}
</style>
