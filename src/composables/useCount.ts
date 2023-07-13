import { ref, unref, type Ref } from "vue";

export interface CountOptions {
  initial?: number;
  min?: number | Ref<number>;
  max?: number | Ref<number>;
}

export const useCount = (options?: CountOptions) => {
  const count = ref(options?.initial || 0);

  const gtMax = () => {
    return (
      unref(options?.max) !== undefined &&
      unref(options?.max) !== null &&
      unref(options?.max!) <= count.value
    );
  };

  const ltMin = () => {
    return (
      unref(options?.min) !== undefined &&
      unref(options?.min) !== null &&
      unref(options?.min!) >= count.value
    );
  };

  const add = (step = 1) => {
    if (gtMax()) return;
    count.value = count.value + step;
  };

  const sub = (step = 1) => {
    if (ltMin()) return;
    count.value = count.value - step;
  };

  const update = (value: number) => {
    if (gtMax() && ltMin()) return;
    count.value = value;
  };

  return {
    count,
    add,
    sub,
    update,
  };
};
