import { defineComponent, nextTick, onMounted, onUpdated, ref, watchEffect } from "vue";

export const Scrollbar = defineComponent({
  name: "Scrollbar",
  props: {
    height: {
      type: Number,
      default: 400,
    },
  },
  emits: ["scroll"],
  setup(props, { slots, emit }) {
    let beforeScrollTop = 0;
    let beforeScrollLeft = 0;
    const thumbHeight = ref(0);
    const thumbWidth = ref(0);
    const thumbOffsetX = ref(0);
    const thumbOffsetY = ref(0);
    const isShowBar = ref(false);
    const isShowBarX = ref(false);
    const isShowBarY = ref(false);
    const wrpperEl = ref<HTMLElement>();
    const thumbXEl = ref<HTMLElement>();
    const thumbYEl = ref<HTMLElement>();

    const updateThumb = () => {
      if (!wrpperEl?.value) return;
      const minWidth = 20;
      thumbHeight.value = Math.max(
        wrpperEl.value.clientHeight ** 2 / wrpperEl.value.scrollHeight,
        minWidth
      );
      thumbWidth.value = Math.max(
        wrpperEl.value.clientWidth ** 2 / wrpperEl.value.scrollWidth,
        minWidth
      );
    };

    onMounted(() => {
      updateThumb();
    });

    watchEffect(() => {
      if (!wrpperEl?.value) return;
      isShowBarY.value =
        wrpperEl.value.offsetHeight < wrpperEl.value.scrollHeight;
      isShowBarX.value =
        wrpperEl.value.offsetWidth < wrpperEl.value.scrollWidth;
    });

    const onMousedown = (direction: string) => {
      return (evt: MouseEvent) => {
        if (!wrpperEl.value) return;
        let trackHeight = wrpperEl.value.clientHeight;
        let trackWidth = wrpperEl.value.clientWidth;
        let currentThumbOffset = 0;
        let moveStart = 0;

        if (direction === "y") {
          currentThumbOffset = thumbOffsetY.value;
          moveStart = evt.screenY;
        } else {
          currentThumbOffset = thumbOffsetX.value;
          moveStart = evt.screenX;
        }

        if (evt.target !== thumbXEl.value && evt.target !== thumbYEl.value) {
          if (direction === "y") {
            thumbOffsetY.value = evt.offsetY - thumbHeight.value / 2;
            const top =
              wrpperEl.value.scrollHeight * (thumbOffsetY.value / trackHeight);
            return wrpperEl.value.scrollTo({ top });
          }
          thumbOffsetX.value = evt.offsetX - thumbWidth.value / 2;
          const left =
            wrpperEl.value.scrollWidth * (thumbOffsetX.value / trackWidth);
          return wrpperEl.value.scrollTo({ left });
        }

        const movelistener = (evt: MouseEvent) => {
          if (!wrpperEl.value) return;
          const moveEnd = direction === "y" ? evt.screenY : evt.screenX;
          if (direction === "y") {
            thumbOffsetY.value = Math.max(
              Math.min(currentThumbOffset + moveEnd - moveStart, trackHeight - thumbHeight.value),
              0
            );
            const top =
              wrpperEl.value.scrollHeight * (thumbOffsetY.value / trackHeight);
            return wrpperEl.value.scrollTo({ top });
          }
          thumbOffsetX.value = Math.max(
            Math.min(currentThumbOffset + moveEnd - moveStart, trackWidth - thumbWidth.value),
            0
          );
          const left =
            wrpperEl.value.scrollWidth * (thumbOffsetX.value / trackWidth);
          return wrpperEl.value.scrollTo({ left });
        };
        const defaultSelectstart = document.onselectstart;
        const clean = () => {
          document.removeEventListener("mousemove", movelistener);
          document.removeEventListener("mouseup", clean);
          document.onselectstart = defaultSelectstart;
        };
        document.addEventListener("mousemove", movelistener);
        document.addEventListener("mouseup", clean);
        document.onselectstart = () => false;
      };
    };

    const onScroll = (evt: UIEvent) => {
      const target = evt.target;
      if (beforeScrollTop !== target.scrollTop) {
        thumbOffsetY.value =
          (target.scrollTop * target.clientHeight) / target.scrollHeight;
        beforeScrollTop = target.scrollTop;
      }
      if (beforeScrollLeft !== target.scrollLeft) {
        thumbOffsetX.value =
          (target.scrollLeft * target.clientWidth) / target.scrollWidth;
        beforeScrollLeft = target.scrollLeft;
      }
      updateThumb();
      emit("scroll", evt);
    };

    const onMouseenter = () => {
      isShowBar.value = true;
    };

    const onMouseleave = () => {
      isShowBar.value = false;
    };

    return () => (
      <div
        class="pl-scrollbar-container"
        style={`height: ${props.height}px`}
        onMouseenter={onMouseenter}
        onMouseleave={onMouseleave}
      >
        <div ref={wrpperEl} class="pl-scrollbar-wrpper" onScroll={onScroll}>
          {slots.default?.()}
        </div>
        <div
          class="pl-scrollbar-bar pl-scrollbar-bar--x"
          onMousedown={onMousedown("x")}
        >
          <div
            ref={thumbXEl}
            v-show={isShowBar.value && isShowBarX.value}
            class="pl-scrollbar-bar-thumb pl-scrollbar-bar-thumb--x"
            style={`width: ${thumbWidth.value}px; transform: translateX(${thumbOffsetX.value}px)`}
          />
        </div>
        <div
          class="pl-scrollbar-bar pl-scrollbar-bar--y"
          onMousedown={onMousedown("y")}
        >
          <div
            ref={thumbYEl}
            v-show={isShowBar.value && isShowBarY.value}
            class="pl-scrollbar-bar-thumb pl-scrollbar-bar-thumb--y"
            style={`height: ${thumbHeight.value}px; transform: translateY(${thumbOffsetY.value}px)`}
          />
        </div>
      </div>
    );
  },
});
