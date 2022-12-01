<script setup>
import { ref, onBeforeMount } from "vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  item: { type: Object, required: true },
});

const question = ref("");
const answers = ref([]);

const isAnswered = ref(false);
const isCorrect = ref(false);

function close() {
  emit("close");
}

function checkAnswer(ans) {
  isAnswered.value = true;
  isCorrect.value = ans ? "Teisingai" : "Neteisingai";
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
      <h1>Klausimas</h1>
      {{ question }}
      <h3 class="answers-header">Atsakymo variantai:</h3>
      <div class="answers">
        <button
          @click="checkAnswer(answer.is_correct)"
          v-for="answer in answers"
          :key="answer.id"
        >
          {{ answer.answer }}
        </button>
      </div>
      <div v-show="isAnswered">{{ isCorrect }}</div>
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

.answers {
  display: grid;
  grid-template-columns: 300px;
}

.answers-header {
  margin-top: 8px;
}
</style>
