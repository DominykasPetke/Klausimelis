<script setup>
import { ref, inject, onBeforeMount } from "vue";

const baseAPIURL = inject("baseAPIURL");
const topics = ref([]);
const isLoading = ref(true);

console.log(topics.value);

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
      console.log(res);
      const ret = res.json();
      console.log(ret);
      return ret;
    })
    .then((json) => {
      console.log(json);

      topics.value = json;
      isLoading.value = false;
      console.log(topics.value);
      console.log(!isLoading.value);
    });
}

onBeforeMount(() => {
  getData();
});

// onMounted(() => {
//   getData();
// });
// const data = await req.json();
// topics.value = data;
</script>

<template>
  Topics.
  {{ baseAPIURL + "/topics" }}
  <div v-show="!isLoading">
    {{ topics }}
    <ul v-for="item in topics" :key="item.id">
      <li>{{ item.name }}</li>
    </ul>
  </div>
</template>

<style></style>
