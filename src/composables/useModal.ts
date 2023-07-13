import { ref, watchEffect } from "vue";
import { useDisplay, useOutside, useExpose } from ".";

export const useModal = () => {
    const modal = ref<HTMLElement>();
    const scoped = useDisplay();
    const { isOutside } = useOutside(modal, scoped.visible);
  
    watchEffect(() => isOutside.value && (scoped.visible.value = false));
    useExpose(scoped)
  
    return {
      modal,
      scoped
    }
  }