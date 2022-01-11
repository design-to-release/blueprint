<script lang="ts" context="module">
  import type { CS as CreativeSection } from "./creative.svelte";
  import hljs from "highlight.js";
  import { Svg } from "./components";
  import Nodes from "./nodes.svelte";
  import Creative from "./creative.svelte";

  export interface Element {
    label: string;
    nodes: Array<{ label: string }>;
    variant: CreativeSection;
    prop: CreativeSection;
  }
</script>

<script lang="ts">
  console.log(location)
  let root = {
    label: "Button",
    nodes: [
      {
        label: "Prefix Slot",
      },
    ],
    variant: {
      label: "变体 Variants",
      list: [],
    } as CreativeSection,
    prop: {
      label: "数据 Props",
      list: [],
    } as CreativeSection,
  };

  const jsonString = new URL(location as any).searchParams.get("json");
  if (jsonString) {
    root = JSON.parse(jsonString);
  }

  let previewText: string;

  $: if (root) {
    previewText = JSON.stringify(root, undefined, 2);
    history.pushState(
      undefined,
      "",
      `${location.pathname}?json=${encodeURIComponent(previewText)}`
    );
  }
</script>

<section class="page">
  <!-- Nodes view -->
  <section class="nodes">
    <h1>{root.label} 关键节点列表</h1>
    <nav>
      <Nodes bind:nodes={root.nodes} />
    </nav>
  </section>

  <!-- Preview -->
  <section class="preview">
    <pre>
      <code>
        {@html hljs.highlightAuto(previewText).value}
      </code>
    </pre>
    <section class="svg-container">
      <div
        class="svg"
        on:click={() =>
          navigator.clipboard.writeText(previewText).then(() => {
            alert("复制成功");
          })}
      >
        <Svg src={import("./assets/copy.svg")} />
      </div>
      <a class="svg" href="./preview.html?json={encodeURIComponent(previewText)}" target="_blank">
        <Svg src={import("./assets/preview.svg")} />
      </a>
    </section>
  </section>

  <!-- Component drafting -->
  <Creative
    bind:variantSection={root.variant}
    bind:propSection={root.prop}
    title={root.label}
  />
</section>

<style scoped>
  .page {
    height: 100%;
    display: flex;
  }

  .nodes h1 {
    text-align: center;
  }

  .preview {
    position: relative;
    flex-grow: 1;
  }

  .preview > pre {
    background-color: #f3f2f1;
    margin: 0;
    height: 100%;
  }

  .preview > pre > code {
    display: inherit;
  }

  .preview > .svg-container {
    position: absolute;
    top: 0;
    right: 0;
  }

  .preview > .svg-container > .svg {
    display: block;
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    box-sizing: content-box;
    padding: 8px;
    margin: 8px;
  }
</style>
