<script lang="ts" context="module">
  import { createEventDispatcher } from "svelte";
</script>

<script lang="ts">
  export let placeholder = "";
  export let value = "";
  export let disabled = false;

  let prevPressKey: string;
  const dispatch = createEventDispatcher<{
    change: { value: string; key: string };
  }>();

  function fireChange() {
    dispatch("change", { value, key: prevPressKey });
  }

  $: (value || true) && fireChange();
  $: if (inputEl) {
    inputEl.contentEditable = `${!disabled}`
  }

  let inputEl: HTMLDivElement;
</script>

<section class="root" class:disabled>
  <slot name="prefix" />
  <div class="input">
    {#if !value}
      <span class="placeholder">
        {placeholder}
      </span>
    {/if}
    <div
      contenteditable
      bind:textContent={value}
      bind:this={inputEl}
      on:keypress={(ev) => (prevPressKey = ev.key)}
    >
      <slot />
    </div>
  </div>
  <slot name="suffix" />
</section>

<style>
  .root {
    cursor: default;
    display: flex;
    color: #201f1e;
    border: 1px solid #b3b0ad;
    border-radius: 2px;
    outline: transparent;
    width: 100%;
    height: 30px;
    align-items: center;
  }

  .root.disabled {
    background-color: #f3f2f1;
    border-color: #f3f2f1;
  }

  .input {
    position: relative;
    width: 100%;
    padding: 0 4px;
    white-space: nowrap;
  }

  .placeholder {
    position: absolute;
    color: gray;
  }

  .input [contenteditable] {
    position: relative;
    cursor: text;
    outline: none;
  }
</style>
