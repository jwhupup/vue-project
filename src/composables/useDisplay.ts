import { ref, watch, type Ref, type WatchStopHandle } from "vue"

export interface CloseOption {
    delay?: number
}

export interface DisplayHandler {
    visible: Ref<boolean>;
    open: () => any;
    close: (option?: CloseOption) => any;
    toggle: () => any;
    onOpen: (cb: () => any) => WatchStopHandle;
    onClose: (cb: () => any) => WatchStopHandle;
}

export function useDisplay(): DisplayHandler {
    const visible = ref(false)
    const onOpen = (cb: () => any) => watch(visible, () => visible.value && cb?.())
    const onClose = (cb: () => any) => watch(visible, () => visible.value || cb?.())
    const toggle = () => visible.value = !visible.value
    const open = () => visible.value = true
    const close = (option?: CloseOption) => {
        if (option?.delay) {
            const timer = setTimeout(() => (visible.value = false) && clearTimeout(timer), option.delay)
        } else {
            visible.value = false
        }
    }

    return { 
        visible, 
        toggle,
        open, 
        close,
        onOpen,
        onClose
    }
}
