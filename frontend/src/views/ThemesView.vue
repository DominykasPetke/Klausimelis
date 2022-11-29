<script setup>
import { ref, inject, onBeforeMount } from "vue";

const baseAPIURL = inject("baseAPIURL");
const topics = ref([]);
const isLoading = ref(true);

async function getTopics() {
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
  getTopics();
});
</script>

<template>
  Klausimėlio temos:
  <br />
  Pasirinkite sritį:
</template>

<style></style>
