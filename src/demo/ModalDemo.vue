<template>
  <!-- <button @click="prompt?.toggle">toggle prompt</button>
  <Prompt ref="prompt"></Prompt>

  <br />
  <button @click="drawer?.toggle">toggle drawer</button>
  <Drawer ref="drawer"></Drawer> -->

  <Popover
    ref="popover"
    title="Popover Title"
    content="This is popover content!"
  >
    <template #reference>
      <button>open popover</button>
    </template>
  </Popover>

  <!-- <Tooltip content="This is tooltip content!">
    <template #headless>
      <div style="background: blue">This is tooltip content!!!!</div>
    </template>
    <template #reference>
      <button>open tooltip</button>
    </template>
  </Tooltip>

  <button @click="handleNotification">notification</button>

  <button @click="handleMessage">message</button>

  <Dropdown :data="list">
    <template #reference>
      <button>dropdown</button>
    </template>
  </Dropdown> -->
</template>

<script setup lang="ts">
import { createVNode, onMounted, ref } from "vue";
import {
  Prompt,
  Drawer,
  Popover,
  Tooltip,
  Notification,
  Message,
  Dropdown,
} from "../components/modal/modal";
import type { DisplayHandler } from "../composables";
import CustomNotification from "../customNotification";

const prompt = ref<DisplayHandler>();

onMounted(() => {
  prompt.value?.onOpen(() => {
    console.log("open!!");
  });

  prompt.value?.onClose(() => {
    console.log("close!!");
  });
});

const drawer = ref<DisplayHandler>();
const popover = ref<DisplayHandler>();

const handleNotification = () => {
  Notification({
    title: "2312",
    content: Math.random(),
  });
  // Notification(CustomNotification);
};

const handleMessage = () => {
  Message({
    content: Math.random(),
  });
};

const list = ref([
  {
    title: "btn 1",
    children: [
      { title: "btn 1 1" },
      {
        title: "btn 1 2",
        children: [
          { title: "btn 1 1 1" },
          { title: "btn 1 1 2" },
          { title: "btn 1 1 3" },
        ],
      },
    ],
  },
  { title: "btn 2" },
]);
</script>
