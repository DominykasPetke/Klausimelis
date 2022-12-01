<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { isCorrectTeacher, isTeacherOnAny } from "../utilities";
import DeleteModal from "../modals/DeleteModal.vue";
import QuestionModal from "../modals/QuestionModal.vue";

const baseAPIURL = inject("baseAPIURL");
const token = localStorage.getItem("token");

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

const selectedTopicId = ref(null);
const isThemesLoading = ref(true);
const themes = ref([]);

function onTopicSelectChange() {
  isThemesLoading.value = true;
  isQuestionsLoading.value = true;
  getThemes();
  getAllQuestions();
}

async function getThemes() {
  return fetch(baseAPIURL + "/topics/" + selectedTopicId.value + "/themes")
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

const selectedThemeId = ref(null);
const isQuestionsLoading = ref(true);
const questions = ref([]);

async function getAllQuestions() {
  return fetch(baseAPIURL + "/topics/" + selectedTopicId.value + "/questions", {
    headers: {
      Authorization: "Bearer " + (token == null ? "" : token),
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
      questions.value = json;
      isQuestionsLoading.value = false;
    });
}

function getThemeUserId() {
  if (themes.value == null) {
    return 0;
  }

  const result = themes.value.find((element) => {
    return element.id == selectedThemeId.value;
  });

  if (result == null) {
    return 0;
  }

  return result.user.id;
}

async function getQuestions() {
  return fetch(
    baseAPIURL +
      "/topics/" +
      selectedTopicId.value +
      "/themes/" +
      selectedThemeId.value +
      "/questions",
    {
      headers: {
        Authorization: "Bearer " + (token == null ? "" : token),
      },
    }
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

const openedDeleteModal = ref(0);

function showDeleteModal(id) {
  openedDeleteModal.value = id;
}

function closeDeleteModal() {
  openedDeleteModal.value = 0;
}

const openedEditModal = ref(0);

function showEditModal(id) {
  openedEditModal.value = id;
}

function closeEditModal() {
  openedEditModal.value = 0;
}

const openedCreateModal = ref(false);

function showCreateModal() {
  openedCreateModal.value = true;
}

function closeCreateModal() {
  openedCreateModal.value = false;
}
</script>

<template>
  <h1>Klausimėlio klausimai:</h1>
  <div v-show="!isTopicsLoading">
    <div class="grid">
      Pasirinkite sritį:
      <select @change="onTopicSelectChange()" v-model="selectedTopicId">
        <option v-for="topic in topics" :key="topic.id" :value="topic.id">
          {{ topic.name }}
        </option>
      </select>
    </div>

    <div v-show="!isThemesLoading">
      <div class="grid">
        Pasirinkite temą:
        <select @change="onThemeSelectChange()" v-model="selectedThemeId">
          <option v-for="theme in themes" :key="theme.id" :value="theme.id">
            {{ theme.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-show="!isQuestionsLoading">
      <table class="questionTable">
        <tr>
          <th>Klausimas</th>
          <th>Kūrėjas</th>
          <th v-if="isTeacherOnAny(questions)">Redaguoti</th>
          <th v-if="isTeacherOnAny(questions)">Trinti</th>
        </tr>
        <tr v-for="item in questions" :key="item.id">
          <td>{{ item.question }}</td>
          <td>
            <RouterLink
              :to="{ path: '/user', query: { userId: item.user.id } }"
              >{{ item.user.username }}</RouterLink
            >
          </td>
          <td v-if="isCorrectTeacher(item.user.id)">
            <a @click="showEditModal(item.id)">Redaguoti</a>
            <QuestionModal
              :item="item"
              method="PUT"
              :link="
                '/topics/' +
                selectedTopicId +
                '/themes/' +
                selectedThemeId +
                '/questions/' +
                item.id
              "
              mode="edit"
              v-show="openedEditModal == item.id"
              @close="closeEditModal"
            />
          </td>
          <td v-else-if="isTeacherOnAny(questions)"></td>
          <td v-if="isCorrectTeacher(item.user.id)">
            <a @click="showDeleteModal(item.id)">Ištrinti</a>
            <DeleteModal
              :item="item"
              :link="
                '/topics/' +
                selectedTopicId +
                '/themes/' +
                selectedThemeId +
                '/questions/' +
                item.id
              "
              v-show="openedDeleteModal == item.id"
              @close="closeDeleteModal"
            />
          </td>
          <td v-else-if="isTeacherOnAny(questions)"></td>
        </tr>
      </table>
      <a v-if="isCorrectTeacher(getThemeUserId())" @click="showCreateModal"
        >Sukurti naują klausimą</a
      >
      <QuestionModal
        v-show="openedCreateModal"
        @close="closeCreateModal"
        method="POST"
        :link="
          '/topics/' +
          selectedTopicId +
          '/themes' +
          selectedThemeId +
          '/questions/'
        "
        mode="create"
      />
    </div>
  </div>
</template>

<style>
.questionTable,
th,
td {
  border-width: 1px;
  border-color: rgb(102, 153, 0);
  border-collapse: collapse;
  border-style: solid;
}

td {
  padding: 4px;
}

.grid {
  display: grid;
  grid-template-columns: 150px 300px;
  margin-bottom: 8px;
}
</style>
