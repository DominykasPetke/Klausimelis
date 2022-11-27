<script setup>
import { RouterLink, RouterView } from "vue-router";

import AppMenu from "./components/AppMenu.vue";
</script>

<template>
  <header>
    <RouterLink to="/">
      <img
        alt="Klausimėlis logo"
        class="logo"
        src="./assets/question.svg"
        width="32"
        height="32"
      />
    </RouterLink>

    <RouterLink to="/">
      <h1 class="green">Klausimėlis</h1>
    </RouterLink>

    <AppMenu />
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <p class="left">Klausimėlis, 2022.</p>
    <p class="right">Autorius: Dominykas Petkevičius, IFF-9/7</p>
  </footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  background-color: rgba(102, 153, 0, 0.25);
  color: white;
  padding: 0.5rem;
  width: 100%;
}

.logo {
  display: block;
  margin: 0 auto;
}

main {
  width: 95%;
  margin: auto;
}

h1 {
  font-weight: 400;
  font-size: 1.5rem;
  text-align: center;
  margin-right: 0.5rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  h1 {
    text-align: left;
  }

  .logo {
    margin: 0 1rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

footer {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 120px 1fr;
  column-gap: 8px;
  grid-auto-rows: min-content;
}

footer .right {
  text-align: right;
}
</style>
