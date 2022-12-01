<script setup>
import { ref, inject, onBeforeMount } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  item: { type: Object, required: false },
  mode: { type: String, required: true },
  link: { type: String, required: true },
  method: { type: String, required: true },
  thing: { type: String, required: true },
});

const baseAPIURL = inject("baseAPIURL");
const token = localStorage.getItem("token");

const name = ref("");
const description = ref("");

const errorMessage = ref("");
const isError = ref(false);

function close() {
  emit("close");
}

async function createThing() {
  if (name.value.length <= 0) {
    isError.value = true;
    errorMessage.value = "Pavadinimą įvesti būtina.";

    return null;
  }

  return fetch(baseAPIURL + props.link, {
    method: props.method,
    headers: {
      Authorization: "Bearer " + (token == null ? "" : token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name.value, description: description.value }),
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
    })
    .catch((e) => {
      console.log(e);
      console.log(e.json.message);
      // errorMessage.value = e.json.message;

      if (e.message == "Bad Request") {
        if (e.json.message == "Not enough paramaters supplied") {
          errorMessage.value = "Įvesti ne visi laukai.";
        } else {
          errorMessage.value = e;
        }
      } else {
        errorMessage.value = e;
      }
    });
}

function getThing() {
  switch (props.thing) {
    case "topic":
      return "Srities";
    case "theme":
      return "Temos";
    default:
      break;
  }
}

function getMode() {
  switch (props.mode) {
    case "edit":
      return "redagavimas";
    case "create":
      return "kūrimas";
    default:
      break;
  }
}

function getMode2() {
  switch (props.mode) {
    case "edit":
      return "Redaguoti";
    case "create":
      return "Sukurti";
    default:
      break;
  }
}

onBeforeMount(() => {
  if (props.item != null) {
    name.value = props.item.name;
    description.value = props.item.description;
  }
});
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button type="button" class="btn-close" @click="close">x</button>
      <h1>{{ getThing() }} {{ getMode() }}</h1>
      <div class="input">
        Pavadinimas:
        <input type="text" v-model="name" />
      </div>
      <div class="input">
        Aprašymas:
        <input type="text" v-model="description" />
      </div>
      <div class="buttonHolder">
        <p></p>
        <button type="button" @click="createThing">{{ getMode2() }}</button>
      </div>
      <div v-show="isError">{{ errorMessage }}</div>
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
  grid-template-columns: 1fr 80px;
  align-content: flex-end;
}

.input {
  display: grid;
  grid-template-columns: 110px 300px;
}
</style>
