<script lang="ts" context="module">
  function pathToUrl(s: string, base: string): string {
    if (s.startsWith("http://") || s.startsWith("https://")) {
      return s;
    }

    return new URL(s, base).href;
  }
</script>

<script lang="ts">
  export let src: string | Promise<{}>;
</script>

{#await src then { default: pathOrUrl = src }}
  {#await fetch(pathToUrl(pathOrUrl, import.meta.url)) then res}
    {#await res.text() then text}
      {@html text}
    {/await}
  {/await}
{/await}
