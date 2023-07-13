<template>
  <!-- <Tabs>
    <template #header="{ name }">
      <div style="width: 100px; color: red">{{ name }}</div>
    </template>
    <TabPane name="tab 1">
      <div>
        This is tab 1111.
        <BeakerIcon style="width: 1rem; height: 1rem" />
      </div>
    </TabPane>
    <TabPane name="tab 2">
      <Tabs>
        <TabPane name="tab 2-1">This is tab 2-1.</TabPane>
        <TabPane name="tab 2-2">This is tab 2-2.</TabPane>
      </Tabs>
    </TabPane>
    <TabPane name="tab 3" style="background: green">
      This is tab 3-default.
    </TabPane>
    <TabPane :name="item.name" v-for="item in panes">
      {{ item.content }}
    </TabPane>
  </Tabs> -->

  <br />
  <br />

  <!-- <Step ref="stepsEl" v-model="steps" />  -->
  <!-- <Breadcrumb ref="stepsEl" v-model="steps" />  -->
  <Pagination ref="stepsEl" :total="paginations" />
  <br />
  <br />
  <button @click="handlePrevClick">prev</button>
  <button @click="handleNextClick">next</button>
  <button @click="handleToggleClick">toggle</button>
  <button @click="handleAddClick">add step</button>
  <button @click="handleSubClick">sub step</button>
</template>

<script setup lang="ts">
import { BeakerIcon } from "@heroicons/vue/20/solid";
import {
  Tabs,
  TabPane,
  Step,
  type StepInstance,
  Breadcrumb,
  Pagination,
} from "../components/step/step";
import { ref } from "vue";

const panes = [
  {
    id: "11",
    name: Math.random().toFixed(3).toString(),
    content: "312321312312",
  },
  {
    id: "12",
    name: Math.random().toFixed(3).toString(),
    content: "adsdsadsadas",
  },
];

const steps = ref([
  {
    name: "Step 1",
    // description: 'This is Step 1',
    // icon: BeakerIcon
  },
  {
    name: "Step 2",
    // description: 'This is Step 2'
  },
  {
    name: "Step 3",
    // description: 'This is Step 3'
  },
]);

const paginations = ref(10);

const stepsEl = ref();

const handlePrevClick = () => {
  stepsEl.value?.prev();
};

const handleNextClick = () => {
  stepsEl.value?.next();
};

const handleToggleClick = () => {
  stepsEl.value?.toggle(2);
};
const handleAddClick = () => {
  const stepName = Math.random().toFixed(2);
  // stepsEl.value?.add({
  //   name: `Step ${stepName}`,
  //   // description: `This is ${stepName}`
  // })
  // stepsEl.value?.add(1);
  paginations.value++
};
const handleSubClick = () => {
  // stepsEl.value?.sub(2);
  paginations.value--

};
</script>
