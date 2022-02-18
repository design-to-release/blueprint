<script setup lang="ts">
import type { Component } from "@/types/component";

import {
    NLayout,
    NConfigProvider,
    darkTheme,
    NMessageProvider,
} from "naive-ui";
import { ref } from "vue";
import AppHeader from "@/components/Header.vue";
import AppSider from "@/components/Sider.vue";
import AppMainPanel from "@/components/MainPanel.vue";

let $component = ref<Component>();

function fetchComponentById(id: string) {
    fetch(`/api/components/${id}`)
        .then((resp) => resp.json())
        .then((component) => {
            $component.value = component;
        });
}
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-message-provider>
            <n-layout position="absolute">
                <app-header style="height: var(--header-height)" />
                <n-layout
                    has-sider
                    position="absolute"
                    style="top: var(--header-height)"
                >
                    <app-sider
                        @update-selected-key="
                            (key, name) => {
                                fetchComponentById(key);
                            }
                        "
                    />
                    <n-layout content-style="padding: 24px;">
                        <app-main-panel
                            v-if="$component"
                            :component="$component"
                        />
                    </n-layout>
                </n-layout>
            </n-layout>
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped></style>
