<script lang="ts" context="module">
  import { tick } from "svelte";
  import { Input, Tag } from "../../components";

  // https://stackoverflow.com/questions/171480/regex-grabbing-values-between-quotation-marks
  const quotationRegex = /^(["'])(?:(?=(\\?))\2.)*?\1$/;

  function extractIfString(input: string): undefined | string {
    if (quotationRegex.test(input)) {
      return input;
    }
  }

  function extractIfNumber(input: string): undefined | number {
    const value = +input;
    if (!Number.isNaN(value)) {
      return value;
    }
  }

  function extractIfBoolean(input: string): undefined | boolean {
    if (input === "true" || input === "false") {
      return Boolean(input);
    }
  }
</script>

<script lang="ts">
  export let splitKey = " ";
  export let placeholder = "";
  export let tags = [];
  export let maxLength = Infinity;
  let value = "";
</script>

<Input
  {placeholder}
  bind:value
  disabled={tags.length >= maxLength}
  on:change={({ detail: { key } }) => {
    if (key !== splitKey || quotationRegex.test(value)) return;

    const pureValue = value.trim();

    if (pureValue === "") return;

    const expectedValue =
      extractIfBoolean(pureValue) ??
      extractIfString(pureValue) ??
      extractIfNumber(pureValue);

    if (expectedValue === undefined) return;

    tags = [...tags, expectedValue];
    tick().then(() => (value = ""));
  }}
>
  <section slot="prefix" class="tag">
    {#each tags as item}
      <Tag
        on:mouseenter={() => {
          console.log("enter");
        }}
      >
        <span>{item}</span>
      </Tag>
    {/each}
  </section>
</Input>

<style>
  .tag {
    display: flex;
    margin: 0 4px;
  }
</style>
