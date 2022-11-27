<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="button">
    {{ text }}
  </div>
</template>

<style>
.button {
  height: 100%;
  margin: 0 1rem;
}
</style>
