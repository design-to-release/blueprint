<script lang="ts" context="module">
  import hljs from "highlight.js";
  import type { TreeNodeOption } from "./node.svelte";
  import Tree from "./tree.svelte";
  // import Settings from './settings.svelte';
  import Creative from "./creative.svelte";
  import ButtonDecl from "./button";
</script>

<script lang="ts">
  let rootNode = ButtonDecl;
  let activeNode: TreeNodeOption;
  let variant: Record<string, unknown>;
  let prop: Record<string, unknown>;

  $: previewText = JSON.stringify({ ...rootNode, variant, prop }, undefined, 2);
</script>

<section class="page">
  <!-- Nodes tree view -->
  <Tree bind:node={rootNode} bind:activeNode />

  <!-- Preview -->
  <section class="preview">
    <pre>
      <code>
        {@html hljs.highlightAuto(previewText).value}
      </code>
    </pre>
    <svg
      aria-hidden="true"
      height="16"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      data-view-component="true"
      on:click={() =>
        navigator.clipboard.writeText(previewText).then(() => {
          alert("复制成功");
        })}
    >
      <path
        fill-rule="evenodd"
        d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
      /><path
        fill-rule="evenodd"
        d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
      />
    </svg>
  </section>

  <!-- Node editor -->
  <!-- <Settings node={activeNode} /> -->

  <!-- Component drafting -->
  <Creative
    bind:variantSection={variant}
    bind:propSection={prop}
    title={rootNode.label}
  />
</section>

<style>
  .page {
    height: 100%;
    display: flex;
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

  .preview > svg {
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
