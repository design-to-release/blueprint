<script setup lang="ts">
import { NSpace } from "naive-ui";
import type { ComponentProperties, ComponentVariants } from "@/types/component";
import ProposalProperties from "./_internal/proposal/Properties.vue";
import ProposalVariants from "./_internal/proposal/Variants.vue";
defineProps<{
    componentId: string;
    properties: ComponentProperties;
    variants: ComponentVariants;
}>();
</script>

<template>
    <n-space vertical>
        <proposal-properties v-bind="{ componentId, properties }" />
        <proposal-variants v-bind="{ componentId, variants }" />
    </n-space>
</template>
