<script setup>
import { ref, inject } from "vue";
import { decodeToken } from "../utilities";

const baseAPIURL = inject("baseAPIURL");

const email = ref("");
const password = ref("");

const response = ref(null);
const isLoading = ref(true);

async function getLogin() {
  return fetch(baseAPIURL + "/login", {
    method: "POST",
    body: JSON.stringify({ email: email.value, password: password.value }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      // a non-200 response code
      if (!res.ok) {
        // create error instance with HTTP status text
        const error = new Error(res.statusText);
        error.json = res.json();
        throw error;
      }

      const ret = res.json();
      return ret;
    })
    .then((json) => {
      localStorage.setItem("token", json.token);
      delete json.token;
      response.value = json;
      isLoading.value = false;
    });
}
</script>

<template>
  <h1>Prisijungimo forma</h1>
  El. paštas: <input type="email" v-model="email" /> Slaptažodis:
  <input type="password" v-model="password" />
  <button @click="getLogin">Login</button>

  <div v-show="!isLoading">{{ decodeToken() }}</div>
</template>

<style></style>
