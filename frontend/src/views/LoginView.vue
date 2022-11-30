<script setup>
import { ref, inject } from "vue";

const baseAPIURL = inject("baseAPIURL");

const email = ref("");
const password = ref("");

const isError = ref(false);
const error = ref(null);

async function getLogin() {
  if (password.value.length <= 0 || email.value.length <= 0) {
    isError.value = true;
    error.value = "Būtina įvesti visus laukus.";

    return null;
  }

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
    })
    .catch((e) => {
      isError.value = true;

      if (e.message == "Unauthorized") {
        error.value = "Neteisingas el. paštas arba slaptažodis";
      } else if (e.message == "Bad Request") {
        if (e.json.message == "Not enough paramaters supplied") {
          error.value = "Įvesti ne visi laukai.";
        }
      } else {
        error.value = e;
      }
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
  <div v-show="isError">{{ error }}</div>
</template>

<style>
.input {
  display: grid;
  grid-template-columns: 100px 300px;
}
</style>
