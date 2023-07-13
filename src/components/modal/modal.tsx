import {
  Transition,
  defineComponent,
  onMounted,
  type PropType,
  ref,
  computed,
  watchEffect,
  createVNode,
  render,
  isVNode,
} from "vue";
import { useDisplay, useModal, useOutside } from "../../composables";
import { createPopper, type Instance, type Placement } from "@popperjs/core";
import { globalVars } from "../globalVars";
import { isObject, isFunction } from '@vue/shared'
import { first2UpperCase } from "../../utils";


export const Prompt = defineComponent({
  name: "Prompt",
  setup(props, { slots }) {
    const { modal, scoped } = useModal();

    const renderPrompt = () => (
      <div
        style={
          "width: 200px; height: 150px; background-color: red; color: #000; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100;"
        }
      >
        <div>Dialog Title inner</div>
        <div>This is modal content.</div>
        <button onClick={() => scoped.close}>close</button>
        <button onClick={() => scoped.close}>ok</button>
      </div>
    );

    return () => (
      <div ref={modal} v-show={scoped.visible.value}>
        {slots.headless?.(scoped) || renderPrompt()}
      </div>
    );
  },
});

export const Drawer = defineComponent({
  name: "Drawer",
  setup(props, { slots }) {
    const { modal, scoped } = useModal();

    const renderDrawer = () => (
      <div
        style={
          "width: 400px; height: 100vh; background-color: pink; color: #000; position: fixed; top: 0; left: 0; z-index: 100;"
        }
      >
        12312
      </div>
    );

    return () => (
      <div ref={modal} v-show={scoped.visible.value}>
        {slots.headless?.(scoped) || renderDrawer()}
      </div>
    );
  },
});

export const Popover = defineComponent({
  name: "Popover",
  props: {
    title: String,
    content: String,
    placement: {
      type: String as PropType<Placement>,
      default: "auto",
    },
    trigger: {
      type: String as PropType<"hover" | "click">,
      default: "hover",
    },
  },
  setup(props, { slots }) {
    let timer = 0;
    let flag = true;
    let popperInstance: Instance;
    const visible = ref(false);
    const popover = ref<HTMLElement>();
    const popoverBtn = ref<HTMLElement>();
    const popoverContainer = ref<HTMLElement>();

    onMounted(() => {
      popperInstance = createPopper(popoverBtn.value!, popover.value!, {
        placement: props.placement,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
    });

    const visibleControl = (enabled: boolean) => {
      visible.value = enabled
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers!,
          { name: "eventListeners", enabled },
        ],
      }));
      enabled && popperInstance.update();
    }

    const onClick = () => {
      if (!visible.value) {
        visibleControl(!visible.value)
      }
    };

    const onBtnClick = (evt: MouseEvent) => {
      if (props.trigger === 'click') {
        evt.stopPropagation()
        visibleControl(!visible.value)
      }
    }

    const onMouseenter = () => {
      flag = false;
      visibleControl(true)
    };

    const onMouseleave = () => {
      flag = true;
      timer = setTimeout(() => {
        clearTimeout(timer);
        flag && visibleControl(false)
      }, 300);
    };

    const eventProps = computed(() => {
      if (props.trigger === 'hover') {
        return { onMouseenter, onMouseleave }
      }
      const { isOutside } = useOutside(popoverContainer, visible)
      watchEffect(() => isOutside.value && (visible.value = false));
      return { onClick }
    })

    const renderPopover = () => (
      <>
        <div>{props.title}</div>
        <div>{props.content}</div>
      </>
    );

    return () => (
      <div ref={popoverContainer} {...eventProps.value}>
        <Transition 
          enter-active-class="animate__animated animate__fadeIn animate__faster"
          leave-active-class="animate__animated animate__fadeOut animate__faster"
          appear
        >
          <div 
            v-show={visible.value} 
            ref={popover} 
            id="popover" 
            class={!slots.headless && 'pl-popover-content'}
          >
            {
              slots.headless?.() ||
                slots.default?.() || 
                  renderPopover()
            }
            {
              slots.headless ? 
                null : 
                <div id="arrow" data-popper-arrow />
            }
          </div>
        </Transition>
        <div ref={popoverBtn} onClick={onBtnClick}>
          {slots.reference?.()}
        </div>
      </div>
    );
  },
});

export const Tooltip = defineComponent({
  name: "Tooltip",
  props: {
    content: String,
    placement: {
      type: String as PropType<Placement>,
      default: "auto",
    },
  },
  setup(props, { slots }) {
    const renderTooptip = () => (
      <div style={'background: red;'}>
        {props.content}
      </div>
    );

    return () => (
      <Popover 
        v-slots={
          {
            headless: slots.headless || renderTooptip,
            reference: slots.reference
          }
        }
        {...props}
      />
    );
  },
});

export const NotificationConstructor = defineComponent({
  name: "Notification",
  props: {
    title: String,
    content: String,
    placement: {
      type: String as PropType<'left' | 'right'>,
      default: 'left'
    }
  },
  setup(props, { slots }) {
    const { visible, open, close } = useDisplay()
    open()

    close({ delay: 3000 })

    const enterAnimate = computed(() => first2UpperCase(props.placement))

    const renderNotification = () => (
      <div 
        style={
          'background: pink; color: #000; width: 200px; height: 100px; border-radius: 10px;'
        }
      >
        <h3>{props.title}</h3>
        <div>{props.content}</div>
      </div>
    );
    
    return () => (
      <Transition 
        enter-active-class={`animate__animated animate__slideIn${enterAnimate.value} animate__faster`}
        leave-active-class="animate__animated animate__slideOutLeft animate__faster"
        appear
      >
        {visible.value ? slots.headless?.()[0] ?? renderNotification() : null}
      </Transition>
    );
  },
})

export const Notification = (options?: any) => {
  if (!globalVars.notificationsContainer) {
    globalVars.notificationsContainer = document.createElement('div')
    globalVars.notificationsContainer.className = 'pl-notification-container'
    document.body.appendChild(globalVars.notificationsContainer)
  }
  const vm = createVNode(
    NotificationConstructor,
    isObject(options) ? { ...options } : null,
    isFunction(options) || isVNode(options)
      ? {
        headless: isFunction(options)
            ? options
            : () => options,
        }
      : null
  )
  const container = document.createElement('div')
  render(vm, container)
  globalVars.notificationsContainer.classList.add(`__${options.placement || 'left'}`)
  globalVars.notificationsContainer.appendChild(container.firstChild!)
}

export const MessageConstructor = defineComponent({
  name: "Message",
  props: {
    content: String,
  },
  setup(props, { slots }) {
    const { visible, open, close } = useDisplay()
    open()

    close({ delay: 3000 })

    const renderNotification = () => (
      <div 
        style={
          'background: green; color: #000; width: 200px; height: 40px; border-radius: 10px;'
        }
      >
        <div>{props.content}</div>
      </div>
    );
    
    return () => (
      <Transition 
        enter-active-class="animate__animated animate__slideInDown animate__faster"
        leave-active-class="animate__animated animate__slideOutUp animate__faster"
        appear
      >
        {visible.value ? slots.headless?.()[0] ?? renderNotification() : null}
      </Transition>
    );
  },
})

export const Message = (options?: any) => {
  if (!globalVars.messagesContainer) {
    globalVars.messagesContainer = document.createElement('div')
    globalVars.messagesContainer.className = 'pl-message-container'
    document.body.appendChild(globalVars.messagesContainer)
  }
  const vm = createVNode(
    MessageConstructor,
    isObject(options) ? { ...options } : null,
    isFunction(options) || isVNode(options)
      ? {
        headless: isFunction(options)
            ? options
            : () => options,
        }
      : null
  )
  const container = document.createElement('div')
  render(vm, container)
  globalVars.messagesContainer.appendChild(container.firstChild!)
}

export const Dropdown = defineComponent({
  name: "Dropdown",
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: "bottom",
    },
    trigger: {
      type: String as PropType<"hover" | "click">,
      default: "hover",
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const renderDropdown = () => (
      <div style={'width: 150px; padding: 10px; background: #999; border-radius: 10px;'}>
        {
          props.data.map(item => {
            if (item.children) {
              return (
                <Dropdown
                  v-slots={{
                    reference: <div>{item.title}</div>,
                  }}
                  data={item.children}
                  trigger={props.trigger}
                  placement="right"
                />
              )             
            }
            return <div>{item.title}</div>
          })
        }
      </div>
    );

    return () => (
      <Popover
        v-slots={{
          reference: slots.reference,
          headless: slots.headless || renderDropdown
        }}
        {...props}
      />
    )
  },
});

