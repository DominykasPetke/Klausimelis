<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/question.svg"
      width="32"
      height="32"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
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
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

main {
  max-width: 95%;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
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
