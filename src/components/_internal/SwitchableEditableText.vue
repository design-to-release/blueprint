<script setup lang="ts">
import { NInput, NP } from "naive-ui";
import { ref, nextTick, watch } from "vue";

const props = defineProps<{
    value: string;
    onUpdateValue: (s: string) => void;
    inputProps: {
        type: "textarea" | "text" | "password";
    };
}>();

const isEdit = ref(false);
const inputRef = ref<HTMLInputElement>();
const inputValue = ref(props.value);
watch(
    () => props.value,
    () => {
        inputValue.value = props.value;
    }
);
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
    <n-input
        v-if="isEdit || value === ''"
        ref="inputRef"
        :value="inputValue"
        @update-value="(v) => (inputValue = v)"
        @change="handleChange"
        @blur="handleChange"
        v-bind="inputProps"
    />
    <n-p v-else style="white-space: pre-line" @click="handleOnClick">{{
        value
    }}</n-p>
</template>
