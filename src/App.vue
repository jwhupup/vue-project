<script setup lang="ts">
import ModalDemo from "./demo/ModalDemo.vue";
import StepDemo from "./demo/StepDemo.vue";
import virtaulDemo from "./demo/virtaulDemo.vue";
import InputDemo from "./demo/InputDemo.vue";
import { Scrollbar } from "./components/scrollbar/scrollbar";
</script>

<template>
  <!-- <ModalDemo /> -->
  <!-- <StepDemo /> -->
  <virtaulDemo />
  <!-- <InputDemo /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
