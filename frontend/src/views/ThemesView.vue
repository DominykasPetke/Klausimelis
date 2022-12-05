<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { isCorrectTeacher, isTeacherOnAny } from "../utilities";
import DeleteModal from "../modals/DeleteModal.vue";
import TopicThemeModal from "../modals/TopicThemeModal.vue";

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

const selectedTopicId = ref(null);
const isThemesLoading = ref(true);
const themes = ref([]);

function onSelectChange() {
  isThemesLoading.value = true;
  getThemes();
}

function getTopicUserId() {
  if (topics.value == null) {
    return 0;
  }

  const result = topics.value.find((element) => {
    return element.id == selectedTopicId.value;
  });

  if (result == null) {
    return 0;
  }

  return result.user.id;
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
  <h1>Klausimėlio temos:</h1>
  <div v-show="!isTopicsLoading">
    <div class="grid">
      Pasirinkite sritį:
      <select @change="onSelectChange()" v-model="selectedTopicId">
        <option v-for="topic in topics" :key="topic.id" :value="topic.id">
          {{ topic.name }}
        </option>
      </select>
    </div>

    <div v-show="!isThemesLoading">
      <table class="themeTable">
        <tr>
          <th>Pavadinimas</th>
          <th>Aprašymas</th>
          <th>Kūrėjas</th>
          <th v-if="isTeacherOnAny(themes)">Redaguoti</th>
          <th v-if="isTeacherOnAny(themes)">Trinti</th>
        </tr>
        <tr v-for="item in themes" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>
            <RouterLink
              :to="{ path: '/user', query: { userId: item.user.id } }"
              >{{ item.user.username }}</RouterLink
            >
          </td>
          <td v-if="isCorrectTeacher(item.user.id)">
            <a @click="showEditModal(item.id)">Redaguoti</a>
            <TopicThemeModal
              :item="item"
              method="PATCH"
              :link="'/topics/' + selectedTopicId + '/themes/' + item.id"
              mode="edit"
              thing="theme"
              v-show="openedEditModal == item.id"
              @close="closeEditModal"
            />
          </td>
          <td v-else-if="isTeacherOnAny(themes)"></td>
          <td v-if="isCorrectTeacher(item.user.id)">
            <a @click="showDeleteModal(item.id)">Ištrinti</a>
            <DeleteModal
              :item="item"
              :link="'/topics/' + selectedTopicId + '/themes/' + item.id"
              v-show="openedDeleteModal == item.id"
              @close="closeDeleteModal"
            />
          </td>
          <td v-else-if="isTeacherOnAny(themes)"></td>
        </tr>
      </table>
      <a v-if="isCorrectTeacher(getTopicUserId())" @click="showCreateModal"
        >Sukurti naują temą</a
      >
      <TopicThemeModal
        v-show="openedCreateModal"
        @close="closeCreateModal"
        method="POST"
        :link="'/topics/' + selectedTopicId + '/themes'"
        mode="create"
        thing="theme"
      />
    </div>
  </div>
</template>

<style>
.themeTable,
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
