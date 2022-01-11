<script lang="ts">
</script>

<section class="root">
  <slot name="prefix" />
  <slot class="content" />
  <slot name="suffix" />
</section>

<style scoped>
  .root {
    display: inline-flex;
    align-items: center;
    transition: 0.13s ease-out;
    border-radius: 15px;
    border: 1px solid #27B8C1;
    padding: 0 14px;
    white-space: nowrap;
  }

  .content {
    min-width: 40px;
    margin: 0 4px;
  }
</style>
