<script setup lang="ts">
import type { RowKey } from "naive-ui/lib/data-table/src/interface";
import type { ComponentProperties, ComponentProperty } from "@/types/component";
import { ref, h, watchEffect } from "vue";
import { NCard, NDataTable, NSpace, NButton } from "naive-ui";
import EditableTable from "../EditableTable.vue";
const props = defineProps<{
    componentId: string;
    properties: ComponentProperties;
}>();

const $oldProperties = ref<ComponentProperties>([]);
const $propertiesEdited = ref(false);
const $checkedProperties = ref<RowKey[]>([]);

watchEffect(() => {
    // trigger update
    props.componentId;

    $propertiesEdited.value = false;
    $checkedProperties.value = [];
});

watchEffect(() => {
    if ($propertiesEdited.value === false) {
        $oldProperties.value = [...props.properties];
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
                    $propertiesEdited.value = true;
                    props.properties[index][key] = v;
                },
            }),
    };
}

function saveProperties() {
    fetch(`/api/components/${props.componentId}`, {
        method: "PATCH",
        body: JSON.stringify({ properties: props.properties }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((resp) => resp.text())
        .then((text) => console.log(text));
}

const propertiesTitle: Array<{ title: string; key: keyof ComponentProperty }> =
    [
        { title: "名称", key: "name" },
        { title: "类型", key: "type" },
        { title: "默认值", key: "defaultValue" },
        { title: "说明", key: "desc" },
    ];
</script>

<template>
    <n-card title="Properties">
        <n-data-table
            :columns="[
                {
                    type: 'selection',
                    disabled: (row) => !row.name,
                },
                ...propertiesTitle.map((i) =>
                    createPropertyColumn(i.title, i.key)
                ),
            ]"
            :data="properties"
            :row-key="(row) => row.name"
            :checked-row-keys="$checkedProperties"
            @update:checked-row-keys="
                (rowKeys) => ($checkedProperties = rowKeys)
            "
        />
        <template #footer>
            <n-space justify="space-between">
                <n-space>
                    <n-button
                        type="primary"
                        @click="
                            properties = [...properties, { ...emptyProperty }];
                            $propertiesEdited = true;
                        "
                        >增加一行</n-button
                    >
                    <n-button
                        :disabled="!$checkedProperties.length"
                        type="error"
                        @click="
                            () => {
                                $propertiesEdited = true;
                                properties = properties.filter(
                                    (i) => !$checkedProperties.includes(i.name)
                                );
                                $checkedProperties = [];
                            }
                        "
                        >删除 {{ $checkedProperties.length }} 行</n-button
                    >
                </n-space>
                <n-space v-if="$propertiesEdited">
                    <n-button
                        @click="
                            properties = [...$oldProperties];
                            $propertiesEdited = false;
                        "
                        >取消</n-button
                    >
                    <n-button
                        type="primary"
                        @click="
                            $propertiesEdited = false;
                            saveProperties();
                        "
                        >保存</n-button
                    >
                </n-space>
            </n-space>
        </template>
    </n-card>
</template>
