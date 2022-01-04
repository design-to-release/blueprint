<script lang="ts" context="module">
  export interface NodeOption {
    label: string;

    [rest: string]: unknown;
  }

  let defaultNameIndex = 0;
</script>

<script lang="ts">
  export let nodes: NodeOption[] = [];
  let activedIndex: number;
</script>

{#each nodes as node, i}
  <section
    class:active={activedIndex === i}
    class="node"
    on:click={() => (activedIndex = i)}
  >
    <input type="text" bind:value={node.label} />
    <section class="action">
      <span
        on:click={() => {
          if (confirm(`您真的忍心删除 “${node.label}” 这个可爱的节点吗？`)) {
            nodes.splice(i, 1);
            nodes = nodes;
          }
        }}
      >
        <svg
          class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="HorizontalRuleIcon"
        >
          <path fill-rule="evenodd" d="M4 11h16v2H4z" />
        </svg>
      </span>
      <span
        on:click={() => {
          nodes.splice(i + 1, 0, {
            label: `Default ${defaultNameIndex++}`,
          });
          nodes = nodes;
        }}
      >
        <svg
          class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-uqopch"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="AddIcon"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </span>
    </section>
  </section>
{/each}

<style>
  .node {
    justify-content: space-between;
  }

  .node .action {
    display: flex;
    margin-left: 36px;
  }

  .node .action > span {
    width: 24px;
    border: 1px solid;
    border-radius: 50%;
    margin-right: 4px;
  }

  .node span:hover {
    color: #0078d4;
    fill: #0078d4;
  }
</style>
