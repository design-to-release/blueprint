<script lang="ts" context="module">
  import type { Element } from "./page.svelte";
  import { marked } from "marked";
</script>

<script lang="ts">
  export let data: Element;
</script>

{@html marked.parse(`
# ${data.label}

### Slots

${data.nodes.map((i) => `- ${i.label}`).join("\n")}

## 组件数据（Props）

| 名称       | 类型                                                         | 默认值         | 说明      |
| -------- | ---------------------------------------------------------- | ----------- | ------- |
${data.prop.list.map(
  (i) =>
    `|${i.name}|${i.types.map((i) => `\`${i}\``).join("\\|")}|\`${
      i.defaultValue
    }\`|${i.desc}|`
)}

## 组件变体（Variants）

| 名称     | 类型                                                            | 默认值         | 说明     |
| ------ | ------------------------------------------------------------- | ----------- | ------ |
${data.variant.list.map(
  (i) =>
    `|${i.name}|${i.types.map((i) => `\`${i}\``).join("\\|")}|\`${
      i.defaultValue
    }\`|${i.desc}|`
)}

`)}
