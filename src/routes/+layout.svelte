<script lang="ts">
  import '../app.scss'
  import { browser } from '$app/environment'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
  import { getMe } from '$lib/queries/user'

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })

  queryClient.ensureQueryData(getMe)
</script>

<QueryClientProvider client={queryClient}>
  <slot />
  <SvelteQueryDevtools />
</QueryClientProvider>

<style>
  :global(body) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
</style>
