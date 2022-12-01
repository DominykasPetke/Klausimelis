<script setup>
import { inject } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  item: { type: Object, required: true },
  link: { type: String, required: true },
});

const baseAPIURL = inject("baseAPIURL");
const token = localStorage.getItem("token");

function close() {
  emit("close");
}

async function deleteThing() {
  console.log(props.link);

  return fetch(baseAPIURL + props.link, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + (token == null ? "" : token),
    },
  })
    .then((res) => {
      if (!res.ok) {
        const error = new Error(res.statusText);
        error.json = res.json();
        throw error;
      }
    })
    .then(() => {
      window.location = "/";
    });
}
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button type="button" class="btn-close" @click="close">x</button>
      <p>Ar jūs norite tai ištrinti?</p>
      <p v-show="item.name != null">Pavadinimas: {{ item.name }}</p>
      <p v-show="item.description != null">Aprašymas: {{ item.description }}</p>
      <p v-show="item.question != null">Klausimas: {{ item.question }}</p>
      <div class="buttonHolder">
        <p></p>
        <button type="button" @click="close">Ne</button>
        <button type="button" @click="deleteThing">Taip</button>
      </div>
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

.buttonHolder {
  margin-top: 8px;
  text-align: right;
  display: grid;
  grid-template-columns: 1fr 60px 60px;
  align-content: flex-end;
}
</style>
