<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="button">
    <RouterLink :to="link">{{ text }}</RouterLink>
  </div>
</template>

<style>
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

@media (min-width: 1024px) {
  .button {
    height: 100%;
    margin: 0 0.5rem;
  }
}
</style>
