<script setup>
import MenuButton from "./MenuButton.vue";
import { ref } from "vue";

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

const navVisible = ref(false);

const toggleMenu = () => {
  navVisible.value = !navVisible.value;
};
</script>

<template>
  <div class="menu" v-for="item in menuItems" :key="item.name">
    <MenuButton :text="item.name" :link="item.link"></MenuButton>
  </div>
  <div class="mobileMenu">
    <button @click="toggleMenu">Click</button>
    <nav v-show="navVisible">
      <div v-for="item in menuItems" :key="item.name">
        <MenuButton :text="item.name" :link="item.link"></MenuButton>
      </div>
    </nav>
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
