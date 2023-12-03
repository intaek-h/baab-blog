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
      const { user, jwt } = data
      localStorage.setItem('base-token', jwt)
      localStorage.setItem('user-id', user.id)
      localStorage.setItem('user-email', user.email)
      localStorage.setItem('user-name', user.username)
      localStorage.setItem('user-createdAt', user.createdAt)
      localStorage.setItem('user-updatedAt', user.updatedAt)

      me.set({
        id: user.id,
        email: user.email,
        name: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })

      return goto('/')
    }

    localStorage.removeItem('base-token')
    localStorage.removeItem('user-id')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-name')
    goto('/')
  })
</script>

<div>welcome!</div>
