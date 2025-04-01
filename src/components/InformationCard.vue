<template>
  <Transition name="fade-slide">
    <article v-if="isOpen" class="information-card" ref="cardRef">
      <div class="cardHeader">
        <button
          type="button"
          class="iconButton closeCard"
          @click="store.closeCard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path
              d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"
              class="icon"
            ></path>
          </svg>
        </button>
        <h4>{{ content.title }}</h4>
      </div>
      <hr />
      <div class="cardContent" v-html="content.content"></div>
    </article>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, Transition } from "vue";

import { useFormUiStore } from "@/stores/formUiStore";
const props = defineProps({
  infoItem: String,
});
const store = useFormUiStore();
const isOpen = computed(() => store.openCard === props.infoItem);
const cardRef = ref(null);

const content = computed(() =>
  store.informationTexts.find((item) => item.id === props.infoItem)
);

const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    cardRef.value &&
    !cardRef.value.contains(event.target) &&
    !event.target.closest("button") // Prevent button clicks from closing the card
  ) {
    store.closeCard();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.information-card {
  position: absolute;
  border-radius: 0.625rem;

  padding: 0.5em 1em;
  background-color: hsl(178, 58%, 97%);
  max-width: 30rem;
  z-index: 1;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
}
hr {
  border-top: 1px solid #00d6d1;
  max-width: 93%;
  margin-left: auto;
}
.cardContent {
  padding-left: 2rem;
  font-size: 0.9rem;
  padding-top: 0.3em;
  direction: rtl;
}

.cardContent ul {
  list-style-position: inside;
  padding: 0;
  margin: 0;
}
</style>
