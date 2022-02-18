<script setup lang="ts">
import { NInput, NIcon, NLayoutHeader } from "naive-ui";
import { Search } from "@vicons/ionicons5";
</script>

<template>
    <n-layout-header class="container flex align-center" bordered>
        <n-input class="search" placeholder="搜索">
            <template #prefix>
                <n-icon :component="Search" />
            </template>
        </n-input>
    </n-layout-header>
</template>

<style scoped>
.container {
    padding: 0.5rem 1rem;
}

.search {
    width: 44rem;
}
</style>
