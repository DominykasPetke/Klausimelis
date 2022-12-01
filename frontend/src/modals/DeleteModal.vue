<script setup>
const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <p>Ar jūs norite tai ištrinti?</p>
      <button type="button" class="btn-close" @click="close">x</button>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: var(--color-background-soft);
  box-shadow: 8px 8px 20px 1px black;
  border-color: black;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding: 2em 1em;
  z-index: 101;
}

.btn-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  color: rgb(102, 153, 0);
  background: transparent;
}

.btn-green {
  color: white;
  background: rgb(102, 153, 0);
  border: 1px solid rgb(102, 153, 0);
  border-radius: 2px;
}
</style>
