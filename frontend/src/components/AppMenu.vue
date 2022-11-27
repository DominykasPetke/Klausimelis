<script setup>
import MenuButton from "./MenuButton.vue";

defineProps({});
</script>

<template>
  <h1 class="green">Klausimėlis</h1>
  <div class="menu">
    <MenuButton text="Sritys"></MenuButton>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 400;
  font-size: 1.5rem;
  text-align: center;
}

@media (min-width: 1024px) {
  h1 {
    text-align: left;
  }
}
</style>
