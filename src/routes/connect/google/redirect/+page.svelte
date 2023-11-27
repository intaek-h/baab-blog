<script lang="ts">
  import { goto } from '$app/navigation'
  import { me } from '$lib/stores/me'
  import { api } from '$lib/utils/fetch'
  import { onMount } from 'svelte'

  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')

    if (accessToken) {
      const { data } = await api.get('/api/auth/google/callback?access_token=' + accessToken)
      const { user } = data

      me.set({
        id: user.id,
        email: user.email,
        name: user.username,
        provider: user.provider,
        confirmed: user.confirmed,
        blocked: user.blocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })

      goto('/')
    }
  })
</script>

<div>welcome!</div>
