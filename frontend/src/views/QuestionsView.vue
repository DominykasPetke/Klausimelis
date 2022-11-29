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

function onTopicSelectChange() {
  isThemesLoading.value = true;
  isQuestionsLoading.value = true;
  getThemes();
  getAllQuestions();
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

const selectedTheme = ref(null);
const isQuestionsLoading = ref(true);
const questions = ref([]);

async function getAllQuestions() {
  return fetch(baseAPIURL + "/topics/" + selectedTopic.value + "/questions")
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
      questions.value = json;
      isQuestionsLoading.value = false;
    });
}

async function getQuestions() {
  return fetch(
    baseAPIURL +
      "/topics/" +
      selectedTopic.value +
      "/themes/" +
      selectedTheme.value +
      "/questions"
  )
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
      questions.value = json;
      isQuestionsLoading.value = false;
    });
}

function onThemeSelectChange() {
  isQuestionsLoading.value = true;
  getQuestions();
}
</script>

<template>
  <h1>Klausimėlio klausimai:</h1>
  <div v-show="!isTopicsLoading">
    Pasirinkite sritį:
    <select @change="onTopicSelectChange()" v-model="selectedTopic">
      <option v-for="topic in topics" :key="topic.id" :value="topic.id">
        {{ topic.name }}
      </option>
    </select>

    <div v-show="!isThemesLoading">
      Pasirinkite temą:
      <select @change="onThemeSelectChange()" v-model="selectedTheme">
        <option v-for="theme in themes" :key="theme.id" :value="theme.id">
          {{ theme.name }}
        </option>
      </select>
    </div>

    <div v-show="!isQuestionsLoading">
      <ul v-for="item in questions" :key="item.id">
        <li>
          {{ item.question }} -
          {{ item.theme != null ? item.theme.name + " - " : "" }}
          <RouterLink
            :to="{ path: '/user', query: { userId: item.user.id } }"
            >{{ item.user.username }}</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style></style>
