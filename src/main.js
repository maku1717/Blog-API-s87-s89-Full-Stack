import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "notyf/notyf.min.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// pages
import RegisterPage from "./pages/registerPage.vue";
import LogoutPage from "./pages/LogoutPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import HomePage from "./pages/HomePage.vue";
import CreatePostPage from "./pages/CreatePostPage.vue";
import ViewPostPage from "./pages/ViewPostPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterPage,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginPage,
    },
    {
      path: "/logout",
      name: "Logout",
      component: LogoutPage,
    },
    {
      path: "/createPost",
      name: "CreatePost",
      component: CreatePostPage,
    },
    {
      path: "/view-post/:id",
      name: "ViewPost",
      component: ViewPostPage,
    },
  ],
});

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.mount("#app");
