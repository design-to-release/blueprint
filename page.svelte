<script lang="ts" context="module">
  import hljs from "highlight.js";
  import { Svg } from "./components";
  import Nodes from "./nodes.svelte";
  // import Settings from './settings.svelte';
  import Creative from "./creative.svelte";
  import ButtonDecl from "./button";
</script>

<script lang="ts">
  let root = ButtonDecl;
  let variant: Record<string, unknown>;
  let prop: Record<string, unknown>;

  $: previewText = JSON.stringify({ ...root, variant, prop }, undefined, 2);
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
    <div
      class="svg"
      on:click={() =>
        navigator.clipboard.writeText(previewText).then(() => {
          alert("复制成功");
        })}
    >
      <Svg src={import("./assets/copy.svg")} />
    </div>
  </section>

  <!-- Node editor -->
  <!-- <Settings node={activeNode} /> -->

  <!-- Component drafting -->
  <Creative
    bind:variantSection={variant}
    bind:propSection={prop}
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

  .preview > .svg {
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    box-sizing: content-box;
    position: absolute;
    top: 0;
    right: 0;
    padding: 8px;
    margin: 8px;
  }
</style>
