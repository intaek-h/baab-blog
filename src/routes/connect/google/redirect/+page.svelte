<script lang="ts">
  import { api } from '$lib/utils/fetch'
  import axios from 'axios'
  import { onMount } from 'svelte'

  export const ssr = false

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    console.log(api)
    const idToken = params.get('id_token')
    if (idToken) {
      axios
        .get('http://localhost:1337/api/auth/google/callback', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
</script>

<div>welcome!</div>
