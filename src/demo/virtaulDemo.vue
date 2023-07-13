<template>
  <div>
    <VirtualList
      :list-height="800"
      :list-item-count="list.length"
      :estimated-list-item-height="50"
    >
      <VirtualListItem v-for="item in list">
        <div style="color: #fff; box-sizing: border-box; padding: 5px">
          {{item}}
        </div>
      </VirtualListItem>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { VirtualList, VirtualListItem } from "../components/virtual/virtual";
import { faker } from "@faker-js/faker";

const list = ref(
  Array(1000)
    .fill(null)
    .map((_) => faker.lorem.sentences())
);

// setInterval(() => list.value.push(faker.lorem.sentences()), 1000)

</script>

<style scoped></style>
