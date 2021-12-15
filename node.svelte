<script lang="ts" context="module">
  import { createEventDispatcher } from "svelte";

  export interface TreeNodeOption {
    label: string;
    children?: TreeNodeOption[];

    [rest: string]: unknown;
  }
</script>

<script lang="ts">
  import { nodePaths } from "./tree.svelte";
  export let node: TreeNodeOption;
  export let indent = 16;
  export let level = 0;
  export let expanded = true;
  export let activePath: string;

  $: isActive = $$props.isActive || nodePaths.get(node) === activePath;

  const dispatch = createEventDispatcher<{
    modifynode: { node: TreeNodeOption; pageX: number; pageY: number };
    active: { node: TreeNodeOption };
  }>();
</script>

<section
  class:hidden={$$props.hidden ?? false}
  class:active={isActive}
  on:contextmenu={(ev) => {
    ev.preventDefault();
    const { pageX, pageY } = ev;
    dispatch("modifynode", { node, pageX, pageY });
  }}
  on:click={() => {
    dispatch("active", { node });
  }}
>
  <span style="flex: 0 0 {indent * level}px" />
  <div
    style="width: 14px;"
    class:retate90={expanded}
    on:click={() => (expanded = !expanded)}
  >
    {#if node.children.length}
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        enable-background="new 0 0 512 512"
        ><g><polygon points="192,128 320,256 192,384" /></g></svg
      >
    {/if}
  </div>
  <span style="color: inherit;">{node.label}</span>
</section>

{#each node.children as node}
  <svelte:self
    hidden={!expanded || $$props.hidden}
    {node}
    {activePath}
    {isActive}
    level={level + 1}
    on:modifynode={(ev) => {
      dispatch("modifynode", ev.detail);
    }}
    on:active={(ev) => {
      dispatch("active", ev.detail);
    }}
  />
{/each}

<style scoped>
  .retate90 {
    transform: rotate(90deg);
  }
</style>
