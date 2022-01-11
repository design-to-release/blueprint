<script lang="ts" context="module">
  import { marked } from "marked";
  import AddItem from "./add_item.svelte";

  export type List = Array<{
    name: string;
    types: string[];
    defaultValue: string;
    desc: string;
  }>;

  export type CS = {
    key: symbol;
    label: string;
    list: List;
  };

  function wrapCodeValue(s: unknown): string {
    return `\`${s}\``;
  }

  function secToStr(list: List): string {
    // @ts-ignore
    return [
      ["名称", "类型", "默认值", "说明"],
      list.map(({ name, types, defaultValue, desc }) => [
        name,
        `${types.map(wrapCodeValue).join(" \\| ")}`,
        wrapCodeValue(defaultValue),
        desc,
      ]),
    ].reduce(
      (acc, curr) =>
        // @ts-ignore
        `|${acc.join("|")}|\r\n|${"-|".repeat(acc.length)}\r\n${curr.reduce(
          (acc, curr) => `${acc}|${curr.join("|")}|\r\n`,
          ""
        )}`
    );
  }
</script>

<script lang="ts">
  export let title: string;
  export let variantSection: CS;
  export let propSection: CS;

  variantSection.key = Symbol("variant");
  propSection.key = Symbol("prop");

  const whichPanelShowAddItem: Record<symbol, boolean> = {};
</script>

<section class="container">
  <h3>{title}</h3>

  {#each [variantSection, propSection] as sec}
    <section>
      <h4>{sec.label}</h4>
      <section style="margin-bottom: 8px;">
        {@html marked.parse(secToStr(sec.list))}
      </section>
      {#if whichPanelShowAddItem[sec.key]}
        <AddItem
          on:confirm={(ev) => {
            sec.list.push(ev.detail);
            // trigger update
            sec.list = sec.list;
            whichPanelShowAddItem[sec.key] = false;
          }}
          on:cancel={() => {
            whichPanelShowAddItem[sec.key] = false;
          }}
        />
      {/if}
      <button
        style="width: 100%;"
        class:hidden={whichPanelShowAddItem[sec.key]}
        on:click={() => {
          whichPanelShowAddItem[sec.key] = true;
        }}>添加一项</button
      >
    </section>
  {/each}
</section>

<style scoped>
  .container {
    border: 1px solid #f3f2f1;
    padding: 0 16px;
  }
</style>
