import { defineComponent } from "vue";

export const Input = defineComponent({
    name: 'Input',
    setup() {

        return () => (
            <div>
                <input type="text" />
            </div>
        )
    }
})