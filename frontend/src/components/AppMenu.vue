<script setup>
import MenuButton from "./MenuButton.vue";

defineProps({});
</script>

<template>
  <div class="menu">
    <MenuButton text="Sritys" link="/about"></MenuButton>
    <MenuButton text="Temos" link="/about"></MenuButton>
    <MenuButton text="Klausimai" link="/about"></MenuButton>
    <MenuButton text="Sritys" link="/about"></MenuButton>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .menu {
    display: flex;
  }
}
</style>
