<script setup>
import { ref, inject, onBeforeMount } from "vue";

const props = defineProps({ userId: String });

const baseAPIURL = inject("baseAPIURL");
const user = ref({});
const isLoading = ref(true);

async function getData() {
  return fetch(baseAPIURL + "/user/" + props.userId)
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
      user.value = json;
      isLoading.value = false;
    });
}

function roleToText(role) {
  switch (role) {
    case "0":
      return "Mokinys (-ė)";
    case "1":
      return "Mokytojas (-a)";
    case "2":
      return "Administratorius (-ė)";
    default:
      break;
  }
}

onBeforeMount(() => {
  getData();
});
</script>

<template>
  User info:
  <div v-show="!isLoading">
    <p>Username: {{ user.username }}</p>
    <p v-if="user.email != null">Email: {{ user.email }}</p>
    <p v-if="user.role != null">Role: {{ roleToText(user.role) }}</p>
  </div>
</template>

<style></style>
