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
  <div class="mobileMenu">Mobile Menu</div>
</template>

<style scoped>
.menu {
  display: none;
}

@media (min-width: 1024px) {
  .menu {
    display: flex;
  }

  .mobileMenu {
    display: none;
  }
}
</style>
