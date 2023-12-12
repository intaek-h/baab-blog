<script lang="ts">
  import { goto } from '$app/navigation'
  import { getMe } from '$lib/queries/user'
  import { api } from '$lib/utils/fetch'
  import { createQuery } from '@tanstack/svelte-query'
  import { onMount } from 'svelte'

  createQuery(getMe)

  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')

    if (accessToken) {
      const { data } = await api.get('/api/auth/google/callback?access_token=' + accessToken)
      const { jwt } = data

      localStorage.setItem('base-token', jwt)

      return goto('/')
    }

    localStorage.removeItem('base-token')
    goto('/')
  })
</script>

<div>welcome!</div>
