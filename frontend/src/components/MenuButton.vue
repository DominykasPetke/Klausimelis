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
    <a href="{{link}}">{{ text }}</a>
  </div>
</template>

<style>
.button {
  height: 100%;
  margin: 0 0.5rem;
}
</style>
