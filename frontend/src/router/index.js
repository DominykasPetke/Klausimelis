/*jshint esversion: 11 */

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/themes",
      name: "themes",
      component: () => import("../views/ThemesView.vue"),
    },
    {
      path: "/topics",
      name: "topics",
      component: () => import("../views/TopicsView.vue"),
    },
    {
      path: "/questions",
      name: "questions",
      component: () => import("../views/QuestionsView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },

  ],
});

export default router;
