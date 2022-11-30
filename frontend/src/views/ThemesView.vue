<script setup>
import { ref, inject, onBeforeMount } from "vue";

const baseAPIURL = inject("baseAPIURL");
const topics = ref([]);
const isTopicsLoading = ref(true);

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
      isTopicsLoading.value = false;
    });
}

onBeforeMount(() => {
  getTopics();
});

const selectedTopic = ref(null);
const isThemesLoading = ref(true);
const themes = ref([]);

function onSelectChange() {
  isThemesLoading.value = true;
  getThemes();
}

async function getThemes() {
  return fetch(baseAPIURL + "/topics/" + selectedTopic.value + "/themes")
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
      themes.value = json;
      isThemesLoading.value = false;
    });
}
</script>

<template>
  <h1>Klausimėlio temos:</h1>
  <div v-show="!isTopicsLoading">
    <div class="grid">
      Pasirinkite sritį:
      <select @change="onSelectChange()" v-model="selectedTopic">
        <option v-for="topic in topics" :key="topic.id" :value="topic.id">
          {{ topic.name }}
        </option>
      </select>
    </div>

    <div v-show="!isThemesLoading">
      <ul v-for="item in themes" :key="item.id">
        <li>
          {{ item.name }} - {{ item.description }} -
          <RouterLink
            :to="{ path: '/user', query: { userId: item.user.id } }"
            >{{ item.user.username }}</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.grid {
  display: grid;
  grid-template-columns: 150px 300px;
}
</style>
