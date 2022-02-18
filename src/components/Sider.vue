<script setup lang="ts">
import type { TreeOption } from "naive-ui";
import { NLayoutSider, NTree, NTreeSelect, NH5 } from "naive-ui";
import type { Key } from "naive-ui/lib/tree/src/interface";
import { onMounted, ref } from "vue";

const componentsTreeNode = new Map<string, TreeOption>();

interface Group {
    id: string;
    name: string;
    components?: string[];
    children?: Group[];
}

function toSelectTreeOptions(groups?: Group[]): TreeOption[] | undefined {
    if (groups?.length) {
        return groups.map(({ id, name, children }) => ({
            label: name,
            key: id,
            children: toSelectTreeOptions(children),
        }));
    }
}

function toComponentsTreeOptions(groups: Group[]): TreeOption[] {
    return groups.map((g) => {
        const children: TreeOption[] = [];
        if (g.children?.length) {
            children.push(...toComponentsTreeOptions(g.children));
        }

        if (g.components?.length) {
            children.push(
                ...g.components.map((c) => ({
                    label: c,
                    key: `${g.id}_components_${c}`.toLowerCase(),
                }))
            );
        }

        const tree = { key: g.id, label: g.name, children };

        componentsTreeNode.set(g.id, tree);

        return tree;
    });
}

const $groupsSelectTree = ref<TreeOption[]>();
const $selectExpandKeys = ref<Key[]>();
const $selectedNodeId = ref<string>("");
const $selectedNodeName = ref<string>();

const $groupsComponentsTree = ref<TreeOption[]>();
const $selectedComponentKeys = ref<string[]>([]);

onMounted(() => {
    fetch("/api/groups")
        .then((resp) => resp.json())
        .then((groups: Group[]) => {
            const selectTreeOptions = toSelectTreeOptions(groups);
            $groupsComponentsTree.value = toComponentsTreeOptions(groups);
            $selectExpandKeys.value = selectTreeOptions?.map((i) => i.key!);
            $groupsSelectTree.value = selectTreeOptions;
        });
});

const emit = defineEmits<{
    (event: "update-selected-key", key: string, name: string): void;
}>();
</script>

<template>
    <n-layout-sider bordered content-style="padding: 24px;">
        <n-tree-select
            :options="$groupsSelectTree"
            :expanded-keys="$selectExpandKeys"
            placeholder="选择组织..."
            @update-expanded-keys="(keys) => ($selectExpandKeys = keys)"
            @update:value="(id, node: TreeOption) => {
                $selectedNodeId = id;
                $selectedNodeName = node.label;
            }"
        />

        <n-h5 style="margin-bottom: 0">{{ $selectedNodeName }}</n-h5>

        <n-tree
            :block-line="true"
            :data="componentsTreeNode.get($selectedNodeId)?.children"
            :selected-keys="$selectedComponentKeys"
            @update-selected-keys="keys => {
                const key: string = keys[0];
                const meta = key.split('_');
                if (meta.length >= 2 && meta[meta.length - 2] === 'components') {
                    $selectedComponentKeys = keys;
                    emit('update-selected-key', keys[0], meta[meta.length - 1]);
                }
            }"
        />
    </n-layout-sider>
</template>
