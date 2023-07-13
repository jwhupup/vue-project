import {
  useStep,
  type ControlInstance,
  useCount,
  useExpose,
} from "@/composables";
import { range } from "@/utils";
import {
  defineComponent,
  provide,
  inject,
  ref,
  h,
  type ExtractPropTypes,
  type InjectionKey,
  type Component,
  type PropType,
  type Ref,
  computed,
  watchEffect,
} from "vue";

const tabHeaderProps = {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
};

export type TabHeaderProps = ExtractPropTypes<typeof tabHeaderProps>;

const PL_TAB_KEY = Symbol() as InjectionKey<{
  headers: Ref<any[]>;
  paneId: Ref<number>;
  currentPaneId: Ref<number>;
}>;

export const TabHeader = defineComponent({
  name: "TabHeader",
  props: tabHeaderProps,
  setup(props, { slots }) {
    const { currentPaneId } = inject(PL_TAB_KEY)!;

    const onClick = () => {
      currentPaneId.value = props.id!;
    };

    const renderHeader = () => (
      <div style={"width: 100px; color: green"}>{props.name}</div>
    );

    return () => (
      <div onClick={onClick}>
        {slots.header?.({ name: props.name }) || renderHeader()}
      </div>
    );
  },
});

export const TabPane = defineComponent({
  name: "TabPane",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const { paneId, currentPaneId, headers } = inject(PL_TAB_KEY)!;
    const id = paneId.value++;

    headers.value.push({ id, name: props.name });

    return () => <div>{currentPaneId.value === id && slots.default?.()}</div>;
  },
});

export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    defaultTab: String,
  },
  setup(props, { slots }) {
    const paneId = ref(0);
    const currentPaneId = ref(0);
    const headers = ref<TabHeaderProps[]>([]);

    if (!slots.default?.()) {
      console.warn("Warn: Tabs missing default slot.");
    }

    provide(PL_TAB_KEY, {
      headers,
      paneId,
      currentPaneId,
    });

    const renderHeader = () => (
      <div style={"display: flex;"}>
        {headers.value.map((hd) => (
          <TabHeader
            id={hd.id}
            name={hd.name}
            v-slots={{
              header: slots.header,
            }}
          />
        ))}
      </div>
    );

    return () => (
      <div>
        {renderHeader()}
        {slots.default?.()}
      </div>
    );
  },
});

export type StepInstance = HTMLElement & ControlInstance<StepItem>;
export type StepItem = {
  name: string;
  description?: string;
  icon?: Component;
};
export const Step = defineComponent({
  name: "Step",
  props: {
    modelValue: Array as PropType<StepItem[]>,
    direction: String,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { steps, current } = useStep<StepItem>(props.modelValue, emit);

    return () => (
      <div style={"display: flex;"}>
        {steps.value?.map((step, index) => (
          <div style={"display: flex; align-items: center;"}>
            <div
              style={`display: flex; align-items: center; ${
                current.value === index && "color: red;"
              }`}
            >
              {step.icon &&
                h(step.icon, { style: "width: 2rem; height: 2rem;" })}
              <div>
                <div>{step.name}</div>
                <div>{step.description}</div>
              </div>
            </div>
            {index + 1 !== steps.value?.length && <div>-----------</div>}
          </div>
        ))}
      </div>
    );
  },
});

export type BreadcrumbInstance = HTMLElement & ControlInstance<BreadcrumbItem>;
export type BreadcrumbItem = {
  name: string;
  separator?: String;
};
export const Breadcrumb = defineComponent({
  name: "Breadcrumb",
  props: {
    modelValue: Array as PropType<BreadcrumbItem[]>,
    separator: {
      type: String as PropType<"/" | ">">,
      default: "/",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { steps, current } = useStep<BreadcrumbItem>(
      props.modelValue,
      emit
    );

    return () => (
      <div style={"display: flex;"}>
        {steps.value?.map((step, index) => (
          <div style={"display: flex; align-items: center;"}>
            <div
              style={`display: flex; align-items: center; ${
                current.value === index && "color: red;"
              }`}
            >
              <div>
                <div>{step.name}</div>
              </div>
            </div>
            {index + 1 !== steps.value?.length && (
              <div style={"margin: 10px;"}>{props.separator}</div>
            )}
          </div>
        ))}
      </div>
    );
  },
});

export type PaginationInstance = HTMLElement &
  Pick<ControlInstance<number>, "current" | "next" | "prev" | "toggle">;
export const Pagination = defineComponent({
  name: "Pagination",
  props: {
    total: {
      type: Number,
      default: 0,
    },
    per: {
      type: Number,
      default: 7,
    },
  },
  setup(props) {
    const total = computed(() => range(2, props.total - 1, 1));

    const {
      count: current,
      add: next,
      sub: prev,
      update: toggle,
    } = useCount({
      initial: 1,
      min: 1,
      max: computed(() => total.value.length + 2),
    });

    useExpose({
      current,
      next,
      prev,
      toggle,
    });

    const start = ref(0);
    const end = ref(props.per - 3);
    const isShowLeftFold = computed(() => current.value * 2 - 1 > props.per)
    const isShowRightFold = computed(() => (props.total - current.value) * 2 - 1 >= props.per)
    const onPrev = () => prev();
    const onNext = () => next();

    const onToggle = (evt: FocusEvent) => {
      toggle(parseInt(evt.target.value));
    };

    watchEffect(() => {
      if (isShowLeftFold.value && isShowRightFold.value) {
        const currentIndex = total.value.findIndex((value) => value === current.value)
        const float = (props.per - 3) / 2
        start.value = currentIndex - float;
        end.value = currentIndex + float + 1;
      }
      else if (isShowLeftFold.value) {
        start.value = total.value.length - props.per + 1;
        end.value = total.value.length;
      }
      else if (isShowRightFold.value) {
        start.value = 0;
        end.value = props.per - 2;
      }
    });

    return () => (
      <div style={"display: flex; gap: 10px;"}>
        <button onClick={onPrev}>{"<"}</button>
        <div
          style={`display: flex; align-items: center;${
            current.value === 1 && "color: red;"
          }`}
        >
          1
        </div>
        <div v-show={isShowLeftFold.value}>...</div>
        {total.value
          ?.slice(start.value, end.value)
          .map((pageNo) => {
            return (
              <div style={"display: flex; align-items: center;"}>
                <div
                  style={`display: flex; align-items: center;${
                    current.value === pageNo && "color: red;"
                  }`}
                >
                  {pageNo}
                </div>
              </div>
            );
          })}
        <div v-show={isShowRightFold.value}>
          ...
        </div>
        <div
          style={`display: flex; align-items: center;${
            current.value === props.total && "color: red;"
          }`}
        >
          {props.total}
        </div>
        <button onClick={onNext}>{">"}</button>
        <input type="number" onBlur={onToggle} />
      </div>
    );
  },
});
