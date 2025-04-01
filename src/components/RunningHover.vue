<template>
  <section>
    <ul>
      <li v-for="(activity, index) in jbActivity?.value" :key="index">
        {{ activity }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useCustomActivity } from "@/composables/useCustomActivity";
import { onMounted } from "vue";

const { jbActivity } = useCustomActivity();
onMounted(() => {
  console.log("jbActivity:", jbActivity.value); // Add this line to debug
});
</script>
