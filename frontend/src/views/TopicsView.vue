<script setup>
import { ref, inject, onBeforeMount } from "vue";
import { isAdmin } from "../utilities";
import DeleteModal from "../modals/DeleteModal.vue";
import TopicThemeModal from "../modals/TopicThemeModal.vue";

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

const openedDeleteModal = ref(0);

function showDeleteModal(id) {
  openedDeleteModal.value = id;
}

function closeDeleteModal() {
  openedDeleteModal.value = 0;
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
  <h1>Klausimėlio sritys:</h1>
  <div v-show="!isLoading">
    <table class="themeTable">
      <tr>
        <th>Pavadinimas</th>
        <th>Aprašymas</th>
        <th>Kūrėjas</th>
        <th v-if="isAdmin()">Trinti</th>
      </tr>
      <tr v-for="item in topics" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>
          <RouterLink
            :to="{ path: '/user', query: { userId: item.user.id } }"
            >{{ item.user.username }}</RouterLink
          >
        </td>
        <td v-if="isAdmin()">
          <a @click="showDeleteModal(item.id)">Ištrinti</a>
          <DeleteModal
            :item="item"
            :link="'/topics/' + item.id"
            v-show="openedDeleteModal == item.id"
            @close="closeDeleteModal"
          />
        </td>
      </tr>
    </table>
    <a v-if="isAdmin()" @click="showCreateModal">Sukurti naują sritį</a>

    <TopicThemeModal
      v-show="openedCreateModal"
      @close="closeCreateModal"
      method="POST"
      link="/topics"
      mode="create"
      thing="topic"
    />
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
</style>
