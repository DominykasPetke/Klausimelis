<script setup>
import { ref, inject } from "vue";

const baseAPIURL = inject("baseAPIURL");

const email = ref("");
const password = ref("");
const username = ref("");

const isError = ref(false);
const error = ref(null);

const registeredUser = ref("");
const isValid = ref(false);

async function getLogin() {
  return fetch(baseAPIURL + "/register", {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      username: username.value,
    }),
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
      registeredUser.value = json.username;
      isValid.value = true;
    })
    .catch((e) => {
      isError.value = true;

      if (e.message == "Forbidden") {
        error.value = "El. paštas sistemoje jau egzistuoja.";
      } else if (e.message == "Bad Request") {
        if (e.json.message == "Invalid email") {
          error.value = "Įvestas el. paštas yra negalimas.";
        } else if (e.json.message == "Not enough paramaters supplied") {
          error.value = "Įvesti ne visi laukai.";
        }
      } else {
        error.value = e;
      }
    });
}
</script>

<template>
  <h1>Registracijos forma</h1>
  <div class="input">
    Slapyvardis:
    <input type="text" v-model="username" />
  </div>
  <div class="input">
    El. paštas:
    <input type="email" v-model="email" />
  </div>
  <div class="input">
    Slaptažodis:
    <input type="password" v-model="password" />
  </div>
  <button @click="getLogin">Registruotis</button>
  <div v-show="isError">{{ error }}</div>
  <div v-show="isValid">
    Sėkmingai užregistruotas vartotojas {{ registeredUser }}.
  </div>
</template>

<style>
.input {
  display: grid;
  grid-template-columns: 100px 300px;
}
</style>
