<script lang="ts" context="module">
  import { createEventDispatcher } from "svelte";
  import { TagsInput } from "./compose_components";
  const TypeOptions = ["string", "boolean", "number"];
  let __componentIndex = 0;
</script>

<script lang="ts">
  const componentIndex = ++__componentIndex;

  let valueCannotLimited = false;

  const dispatch = createEventDispatcher<{
    confirm: {};
    cancel: {};
  }>();

  const form: {
    name?: string;
    type?: string;
    isValueLimited?: boolean;
    optionalValue?: any[];
    defaultValue?: any[];
    desc?: string;
  } = {};
</script>

<section>
  <section class="input-line">
    <label>名称:</label>
    <input type="text" bind:value={form.name} />
  </section>
  <section>
    <section class="input-line" style="justify-content: space-between;">
      <section>
        <input
          disabled={valueCannotLimited}
          bind:checked={form.isValueLimited}
          type="checkbox"
          id="isValueLimited{componentIndex}"
        />
        <label for="isValueLimited{componentIndex}">是否限定值</label>
      </section>
      <section class:hidden={form.isValueLimited}>
        <label>类型:</label>
        <select
          style="margin-right: 4px;"
          on:change={(ev) => {
            valueCannotLimited = ["boolean"].includes(ev.target.value);

            if (valueCannotLimited === false) {
              form.isValueLimited = false;
            }
          }}
          bind:value={form.type}
        >
          {#each TypeOptions as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </section>
    </section>
    <section class:hidden={!form.isValueLimited} class="input-line">
      <label>可选值:</label>
      <TagsInput bind:tags={form.optionalValue} />
    </section>
    <section class="input-line">
      <label>默认值:</label>
      <TagsInput bind:tags={form.defaultValue} maxLength={1} />
    </section>
    <section class="input-line">
      <label>说明:</label>
      <input type="text" bind:value={form.desc} />
    </section>
  </section>
  <section class="action">
    <button
      color="primary"
      class="confirm"
      on:click={() => {
        const {
          name,
          type,
          isValueLimited,
          optionalValue,
          defaultValue,
          desc,
        } = form;

        if (!name || (isValueLimited && !optionalValue) || !desc) {
          return;
        }

        dispatch("confirm", {
          name,
          types: isValueLimited ? optionalValue : [type],
          defaultValue: defaultValue[0],
          desc,
        });
      }}>确认</button
    >
    <button on:click={() => dispatch("cancel")}>取消</button>
  </section>
</section>

<style>
  .input-line {
    display: flex;
    align-items: center;
    padding: 4px 0;
  }
  .input-line > label {
    margin-right: 4px;
    flex-shrink: 0;
  }
  .action {
    margin-top: 8px;
    display: flex;
    justify-content: right;
  }
  .action > .confirm {
    margin-right: 4px;
  }
</style>
