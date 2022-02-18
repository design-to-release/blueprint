<script setup lang="ts">
import type { Component } from "@/types/component";
import { NH1, NTabs, NTabPane, NInput } from "naive-ui";
import AppProposal from "./Proposal.vue";
import AppDesign from "./Design.vue";
import AppCode from "./Code.vue";
import SwitchableEditableText from "./_internal/SwitchableEditableText.vue";
defineProps<{ component: Component }>();

type Step = "proposal" | "design" | "code";
type Status = "wait" | "error" | "finish" | "process";

const tabs: Array<{ step: Step; title: string; status: Status }> = [
    {
        step: "proposal",
        title: "提案",
        status: "wait",
    },
    {
        step: "design",
        title: "设计",
        status: "process",
    },
    {
        step: "code",
        title: "代码示例",
        status: "finish",
    },
];
</script>

<template>
    <n-h1>{{ component.name }}</n-h1>
    <switchable-editable-text
        :input-el="NInput"
        :input-props="{
            type: 'textarea',
        }"
        :value="component.desc"
        :on-update-value="(v) => (component.desc = v)"
    />

    <n-tabs type="line">
        <n-tab-pane
            v-for="tab in tabs"
            :name="tab.step"
            :tab="tab.title"
            v-bind:key="tab.title"
        >
            <app-proposal
                v-if="tab.step === 'proposal'"
                :component-id="component.id"
                :properties="component.properties"
                :variants="component.variants"
            />
            <app-design v-else-if="tab.step === 'design'" />
            <app-code v-else-if="tab.step === 'code'" />
        </n-tab-pane>
    </n-tabs>
</template>
