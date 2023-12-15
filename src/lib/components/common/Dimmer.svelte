<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let show = false

  $: show
    ? document.body.classList.add('overflow-hidden')
    : document.body.classList.remove('overflow-hidden')

  const dispatch = createEventDispatcher()
</script>

<button
  on:click={() => dispatch('close')}
  type="button"
  style="--opacity: {show ? 1 : 0}"
  class={`dimmer fixed bottom-0 left-0 right-0 top-0 bg-black transition-opacity duration-700 ${
    show ? 'visible opacity-100' : 'invisible opacity-0'
  }`}
>
  <slot />
</button>

<style>
</style>
