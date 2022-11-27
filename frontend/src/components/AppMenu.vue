<script setup>
import MenuButton from "./MenuButton.vue";

defineProps({});

const menuItems = [
  {
    name: "Sritys",
    link: "/about",
  },
  {
    name: "Temos",
    link: "/about",
  },
  {
    name: "Klausimai",
    link: "/about",
  },
  {
    name: "Prisijungti",
    link: "/about",
  },
];
</script>

<template>
  <div class="menu" v-for="item in menuItems" :key="item.name">
    <MenuButton :text="item.name" :link="item.link"></MenuButton>
  </div>
  <div class="mobileMenu">
    <li v-for="item in menuItems" :key="item.name">
      <MenuButton :text="item.name" :link="item.link"></MenuButton>
    </li>
  </div>
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
