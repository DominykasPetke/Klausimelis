<script setup>
import TopicsModal from "../modals/TopicsModal.vue";
import { ref } from "vue";

const isModalVisible = ref(false);

function showModal() {
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}
</script>

<template>
  Themes
  <button type="button" class="btn" @click="showModal">Open Modal!</button>

  <TopicsModal v-show="isModalVisible" @close="closeModal" />
</template>

<style></style>
