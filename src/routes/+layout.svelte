<script lang="ts">
  import '../app.scss'
</script>

<slot />

<style>
  :global(body) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
</style>
