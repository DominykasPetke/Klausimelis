<script setup>
import { ref } from "vue";

defineProps({});

const menuItems = ref([
  {
    name: "Sritys",
    link: "/topics",
  },
  {
    name: "Temos",
    link: "/themes",
  },
  {
    name: "Klausimai",
    link: "/questions",
  },
  {
    name: "Apie",
    link: "/about",
  },
  {
    name: "Prisijungti",
    link: "/login",
  },
]);

const navVisible = ref(false);

const toggleMenu = () => {
  navVisible.value = !navVisible.value;
};
</script>

<template>
  <div class="menu" v-for="item in menuItems" :key="item.name">
    <div class="button">
      <RouterLink :to="item.link">{{ item.name }}</RouterLink>
    </div>
  </div>
  <div class="mobileMenu">
    <button class="burger" @click="toggleMenu">
      <img src="../assets/hamborgar.svg" />
    </button>
    <nav v-show="navVisible">
      <div v-for="item in menuItems" :key="item.name">
        <div class="button">
          <RouterLink :to="item.link">{{ item.name }}</RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.menu {
  display: none;
}

.burger {
  background-color: rgba(255, 255, 255, 0.1);
  border: 0;
  width: 100%;
}

@media (min-width: 1024px) {
  .menu {
    display: flex;
  }

  .mobileMenu {
    display: none;
  }

  .button {
    height: 100%;
    margin: 0 0.5rem;
  }
}

@media (max-width: 1024px) {
  .button {
    margin: 0;
    width: 100%;
    border-style: solid;
    border-width: 1px;
    border-color: rgba(102, 153, 0, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    text-align: center;
  }
}
</style>
