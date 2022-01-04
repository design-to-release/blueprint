<script lang="ts" context="module">
  import type { NodeOption } from "./nodes.svelte";
</script>

<script lang="ts">
  export let node: NodeOption;
</script>

{#if node}
  <section>
    <h3>{node.label}</h3>

    <label for="type">type:</label>
    <select id="type">
      <option value="default">default</option>
      <option value="success">success</option>
      <option value="info">info</option>
      <option value="warning">warning</option>
    </select>
  </section>
{/if}
