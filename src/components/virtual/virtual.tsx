import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  ref,
  watchEffect,
  type VNode,
} from "vue";
import { Scrollbar } from "../scrollbar/scrollbar";
import { range } from "@/utils";

export const VirtualListItem = defineComponent({
  name: "VirtualListItem",
  setup(_, { slots }) {
    return () => <div class={"pl-virtual-list-item"}>{slots.default?.()}</div>;
  },
});

export const VirtualList = defineComponent({
  name: "VirtualList",
  props: {
    listHeight: {
      type: Number,
      default: 400,
    },
    listItemCount: {
      type: Number,
      default: 0,
    },
    estimatedListItemHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const start = ref(0);
    const end = ref(0);
    const step = ref(0);
    const translate = ref(0);
    const scrollbarEl = ref<HTMLElement>();
    const listHeight = ref(0);
    watchEffect(() => {
      listHeight.value = props.estimatedListItemHeight * props.listItemCount;
    });

    const itemInfos = computed(() =>
      range(1, props.listItemCount, 1).map((_, index) => ({
        index,
        height: props.estimatedListItemHeight,
        top: props.estimatedListItemHeight * index,
        bottom: props.estimatedListItemHeight * (index + 1),
      }))
    );

    const updateTranslate = () => {
      translate.value =
        start.value >= 1 ? itemInfos.value[start.value - 1].bottom : 0;
    };

    const getStart = (scrollTop = 0) => {
      return itemInfos.value.find((item) => item.bottom > scrollTop)?.index!;
    };

    onMounted(() => {
      if (!scrollbarEl.value) return;
      step.value = end.value = Math.ceil(
        props.listHeight / props.estimatedListItemHeight
      );
    });

    onUpdated(() => {
      const items = document.querySelectorAll(".pl-virtual-list-item");
      items.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const height = rect.height;
        const diff = itemInfos.value[index].height - height;
        if (diff) {
          itemInfos.value[index].height = height;
          itemInfos.value[index].bottom = rect.bottom - diff;
          for (let j = index + 1; j < itemInfos.value.length; j++) {
            itemInfos.value[j].top = itemInfos.value[j - 1].bottom;
            itemInfos.value[j].bottom = itemInfos.value[j].bottom - diff;
          }
        }
      });
      listHeight.value = itemInfos.value[itemInfos.value.length - 1].bottom;
      updateTranslate();
    });

    const onScroll = (evt: UIEvent) => {
      const scrollTop = evt.target.scrollTop;
      start.value = getStart(scrollTop);
      end.value = start.value + step.value;
      updateTranslate();
    };

    const renderVirtualList = () => (
      <>
        <div style={`height: ${listHeight.value}px;`} />
        <div
          style={`position: absolute; top: 0; right: 0; left: 0; transform: translate3d(0, ${translate.value}px, 0);`}
        >
          {(slots.default?.()[0].children as VNode[])?.slice(
            start.value,
            end.value
          )}
        </div>
      </>
    );

    return () => (
      <Scrollbar
        ref={scrollbarEl}
        height={props.listHeight}
        onScroll={onScroll}
        v-slots={{
          default: renderVirtualList(),
        }}
      />
    );
  },
});
