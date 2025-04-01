<template>
  <h1>Show Modal</h1>
  <p>{{ jbActivity }}</p>
</template>

<script setup>
import { useCustomActivity } from "@/composables/useCustomActivity";
import { onMounted } from "vue";

const { jbActivity } = useCustomActivity();
onMounted(() => {
  console.log("jbActivity:", jbActivity.value); // Add this line to debug
});
</script>
