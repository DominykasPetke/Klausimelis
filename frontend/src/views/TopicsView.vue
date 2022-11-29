<script setup>
import { ref, inject, onBeforeMount } from "vue";

const baseAPIURL = inject("baseAPIURL");
const topics = ref([]);
const isLoading = ref(true);

async function getData() {
  return fetch(baseAPIURL + "/topics")
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
      topics.value = json;
      isLoading.value = false;
    });
}

onBeforeMount(() => {
  getData();
});
</script>

<template>
  Topics.
  <div v-show="!isLoading">
    <ul v-for="item in topics" :key="item.id">
      <li>
        {{ item.name }} - {{ item.description }} -
        <RouterLink :to="{ path: '/user', query: { userId: item.user.id } }">{{
          item.user.username
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style></style>
