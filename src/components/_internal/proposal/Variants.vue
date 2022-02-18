<script setup lang="ts">
import type { RowKey } from "naive-ui/lib/data-table/src/interface";
import type { ComponentVariants, ComponentProperty } from "@/types/component";
import { ref, h, watchEffect } from "vue";
import { NCard, NDataTable, NSpace, NButton } from "naive-ui";
import EditableTable from "../EditableTable.vue";
const props = defineProps<{
    componentId: string;
    variants: ComponentVariants;
}>();

const $oldVariants = ref<ComponentVariants>([]);
const $variantsEdited = ref(false);
const $checkedVariants = ref<RowKey[]>([]);

watchEffect(() => {
    // trigger update
    props.componentId;

    $variantsEdited.value = false;
    $checkedVariants.value = [];
});

watchEffect(() => {
    if ($variantsEdited.value === false) {
        $oldVariants.value = [...props.variants];
    }
});

const emptyProperty: ComponentProperty = {
    name: "",
    type: "",
    defaultValue: "",
    desc: "",
};

function createPropertyColumn(title: string, key: keyof ComponentProperty) {
    return {
        title,
        key,
        render: (data: ComponentProperty, index: number) =>
            h(EditableTable, {
                value: data[key],
                onUpdateValue(v) {
                    $variantsEdited.value = true;
                    props.variants[index][key] = v;
                },
            }),
    };
}

function saveVariants() {
    fetch(`/api/components/${props.componentId}`, {
        method: "PATCH",
        body: JSON.stringify({ variants: props.variants }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((resp) => resp.text())
        .then((text) => console.log(text));
}

const variantsTitle: Array<{ title: string; key: keyof ComponentProperty }> = [
    { title: "名称", key: "name" },
    { title: "类型", key: "type" },
    { title: "默认值", key: "defaultValue" },
    { title: "说明", key: "desc" },
];
</script>

<template>
    <n-card title="Variants">
        <n-data-table
            :columns="[
                {
                    type: 'selection',
                    disabled: (row) => !row.name,
                },
                ...variantsTitle.map((i) =>
                    createPropertyColumn(i.title, i.key)
                ),
            ]"
            :data="variants"
            :row-key="(row) => row.name"
            :checked-row-keys="$checkedVariants"
            @update:checked-row-keys="(rowKeys) => ($checkedVariants = rowKeys)"
        />
        <template #footer>
            <n-space justify="space-between">
                <n-space>
                    <n-button
                        type="primary"
                        @click="
                            variants = [...variants, { ...emptyProperty }];
                            $variantsEdited = true;
                        "
                        >增加一行</n-button
                    >
                    <n-button
                        :disabled="!$checkedVariants.length"
                        type="error"
                        @click="
                            () => {
                                $variantsEdited = true;
                                variants = variants.filter(
                                    (i) => !$checkedVariants.includes(i.name)
                                );
                                $checkedVariants = [];
                            }
                        "
                        >删除 {{ $checkedVariants.length }} 行</n-button
                    >
                </n-space>
                <n-space v-if="$variantsEdited">
                    <n-button
                        @click="
                            variants = [...$oldVariants];
                            $variantsEdited = false;
                        "
                        >取消</n-button
                    >
                    <n-button
                        type="primary"
                        @click="
                            $variantsEdited = false;
                            saveVariants();
                        "
                        >保存</n-button
                    >
                </n-space>
            </n-space>
        </template>
    </n-card>
</template>
