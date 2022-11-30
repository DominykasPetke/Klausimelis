<script setup>
import { ref, inject } from "vue";

const baseAPIURL = inject("baseAPIURL");

const email = ref("");
const password = ref("");

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
      window.location = "/";
    });
}
</script>

<template>
  <h1>Prisijungimo forma</h1>
  <div class="input">
    El. paštas:
    <input type="email" v-model="email" />
  </div>
  <div class="input">
    Slaptažodis:
    <input type="password" v-model="password" />
  </div>
  <button @click="getLogin">Prisijungti</button>
</template>

<style>
.input {
  display: grid;
  grid-template-columns: 100px 300px;
}
</style>
