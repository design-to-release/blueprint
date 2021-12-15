<script lang="ts" context="module">
  import type { TreeNodeOption } from "./node.svelte";
  import Node from "./node.svelte";

  export const nodePaths = new WeakMap<TreeNodeOption, string>();

  const LayerX = -9999;
  const LayerY = -9999;
  let layer: HTMLElement;
  let insertDialog: HTMLDialogElement;
  let deleteDialog: HTMLDialogElement;

  function setLayerPos(x = LayerX, y = LayerY): void {
    layer.style.left = `${x}px`;
    layer.style.top = `${y}px`;
  }

  const RootPath = "";
  const PathSplitSymbol = "#";

  function genPathFromNode(node: TreeNodeOption, path = RootPath): void {
    nodePaths.set(node, path);
    for (let i = 0; i < node.children?.length; ++i) {
      genPathFromNode(node.children[i], `${path}${PathSplitSymbol}${i}`);
    }
  }

  function insertNode(node: TreeNodeOption, insertTo: TreeNodeOption): void {
    if (!insertTo.children?.length) {
      insertTo.children = [node];
    } else {
      insertTo.children.push(node);
    }
    const path = nodePaths.get(insertTo);
    genPathFromNode(
      node,
      `${path}${PathSplitSymbol}${insertTo.children.length - 1}`
    );
  }

  function deleteNode(node: TreeNodeOption, root: TreeNodeOption): void {
    const pathStr = nodePaths.get(node);
    if (!pathStr) {
      return;
    }

    const path = pathStr.split(PathSplitSymbol).slice(1);
    let parent = root;
    for (let i = 0; i < path.length - 1; ++i) {
      parent = parent.children[path[i]];
    }

    parent.children.splice(Number(path[path.length - 1]), 1);
  }
</script>

<script lang="ts">
  export let node: TreeNodeOption;
  export let indent = 16;
  export let level = 0;
  export let expanded = true;

  export let activeNode: TreeNodeOption;
  let activePath: string;

  let currNode = node;
  let insertName = "";

  genPathFromNode(node);
</script>

<svelte:body
  on:click={(ev) => {
    if (layer && !layer.isEqualNode(ev.target)) {
      setLayerPos();
    }
  }} />

<nav>
  <Node
    {node}
    {indent}
    {level}
    {expanded}
    {activePath}
    on:modifynode={(ev) => {
      const { pageX: x, pageY: y, node } = ev.detail;
      setLayerPos(x, y);
      currNode = node;
    }}
    on:active={(ev) => {
      const { node } = ev.detail;
      activeNode = node;
      activePath = nodePaths.get(node) ?? "";
    }}
  />
</nav>

<nav bind:this={layer} class="layer" style="left: {LayerX}px; top: {LayerY}px;">
  <section
    class="item"
    on:click={() => {
      insertDialog.showModal();
    }}
  >
    <span>添加新的节点</span>
    <span>➕</span>
  </section>
  <section
    class:hidden={nodePaths.get(currNode) === ""}
    class="item"
    on:click={() => {
      deleteDialog.showModal();
    }}
  >
    <span>删除节点</span>
    <span>➖</span>
  </section>
</nav>

<dialog bind:this={insertDialog}>
  <form method="dialog">
    <h3>即将向 {currNode.label} 添加新的节点</h3>
    <input
      type="text"
      placeholder="name"
      bind:value={insertName}
      style="margin-bottom: 16px;"
    />
    <div style="display: flex; justify-content: flex-end;">
      <button
        color="primary"
        style="margin-right: 8px;"
        on:click={(ev) => {
          const name = insertName?.trim();
          if (!name) {
            ev.preventDefault();
            return;
          }

          insertNode(
            {
              label: name,
              children: [],
            },
            currNode
          );
          insertName = "";

          // trigger update
          node = node;
        }}>确认</button
      >
      <button>取消</button>
    </div>
  </form>
</dialog>

<dialog bind:this={deleteDialog}>
  <form method="dialog">
    <h3>真的要删除 {currNode.label} 吗</h3>
    <div style="display: flex; justify-content: flex-end;">
      <button
        color="primary"
        style="margin-right: 8px;"
        on:click={() => {
          deleteNode(currNode, node);

          // trigger update
          node = node;
        }}>确认</button
      >
      <button>取消</button>
    </div>
  </form>
</dialog>

<style scoped>
  .layer {
    position: absolute;
    width: 192px;
    height: auto;
    background-color: wheat;
    padding: 4px;
  }
  .layer > .item {
    display: flex;
    justify-content: space-between;
  }
  dialog {
    margin-top: 12vh;
  }
</style>
