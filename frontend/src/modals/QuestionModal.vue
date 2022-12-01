<script setup>
import { ref, inject, onBeforeMount } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  item: { type: Object, required: false },
  mode: { type: String, required: true },
  link: { type: String, required: true },
  method: { type: String, required: true },
});

const baseAPIURL = inject("baseAPIURL");
const token = localStorage.getItem("token");

const question = ref("");
const answers = ref([]);

function close() {
  emit("close");
}

async function createThing() {
  return fetch(baseAPIURL + props.link, {
    method: props.method,
    headers: {
      Authorization: "Bearer " + (token == null ? "" : token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question: question.value, answers: answers.value }),
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

function addAnswer() {
  answers.value.push({
    answer: "",
    is_correct: false,
    id: answers.value.length,
  });
}

function removeAnswer() {
  answers.value.pop();
}

onBeforeMount(() => {
  if (props.item != null) {
    question.value = props.item.question;

    if (props.item.answers != null) {
      props.item.answers.forEach((element, index) => {
        answers.value.push({
          answer: element.answer,
          is_correct: element.is_correct ? true : false,
          id: index,
        });
      });
    }
  }
});
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <button type="button" class="btn-close" @click="close">x</button>
      <h1>Klausimo {{ getMode() }}</h1>
      <div class="input">
        Klausimas:
        <input type="text" v-model="question" />
      </div>
      <h3 class="answers-header">Atsakymo variantai:</h3>
      <div v-for="answer in answers" :key="answer.id">
        Atsakymas:
        <input type="text" v-model="answers[answer.id].answer" />
        Ar teisingas:
        <input type="checkbox" v-model="answers[answer.id].is_correct" />
      </div>
      <button type="button" @click="addAnswer">
        Pridėti atsakymo variantą
      </button>
      <button type="button" @click="removeAnswer">
        Pašalinti atsakymo variantą
      </button>

      <div class="buttonHolder">
        <p></p>
        <button type="button" @click="createThing">{{ getMode2() }}</button>
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
  grid-template-columns: 1fr 80px;
  align-content: flex-end;
}

.input {
  display: grid;
  grid-template-columns: 110px 300px;
}

.answers-header {
  margin-top: 8px;
}
</style>
