<script setup>
defineProps({});
</script>

<template>
  <div class="menu">
    <h1 class="green">Klausimėlis</h1>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 400;
  font-size: 1.5rem;
}

.menu h1 {
  text-align: center;
}

@media (min-width: 1024px) {
  .menu h1,
  .menu h3 {
    text-align: left;
  }
}
</style>
