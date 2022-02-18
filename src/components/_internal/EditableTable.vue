<script setup lang="ts">
import { ref, nextTick } from "vue";
import { NInput } from "naive-ui";
const props = defineProps<{
    value: string;
    onUpdateValue: (s: string) => void;
}>();

const isEdit = ref(false);
const inputRef = ref<HTMLInputElement>();
const inputValue = ref(props.value);
function handleOnClick() {
    isEdit.value = true;
    nextTick(() => {
        inputRef.value?.focus();
    });
}
function handleChange() {
    props.onUpdateValue(inputValue.value);
    isEdit.value = false;
}
</script>

<template>
    <section @click="handleOnClick">
        <n-input
            v-if="isEdit || value === ''"
            ref="inputRef"
            :value="inputValue"
            @update-value="(v) => (inputValue = v)"
            @change="handleChange"
            @blur="handleChange"
        />
        <span v-else>{{ value }}</span>
    </section>
</template>
