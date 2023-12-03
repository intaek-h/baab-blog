<script lang="ts">
  import { onMount } from 'svelte'
  import '../app.scss'
  import { me } from '$lib/stores/me'

  onMount(() => {
    const id = localStorage.getItem('user-id')
    const email = localStorage.getItem('user-email')
    const name = localStorage.getItem('user-name')
    const createdAt = localStorage.getItem('user-createdAt')
    const updatedAt = localStorage.getItem('user-updatedAt')

    $me.id = Number(id) || 0
    $me.email = email || ''
    $me.name = name || ''
    $me.createdAt = createdAt || ''
    $me.updatedAt = updatedAt || ''
  })
</script>

<nav class="mb-30 border-b">
  <a href="/">홈으로</a>
  <a href="/articles/write">글쓰기</a>
  <a href={`/@${$me.name}`}>마이페이지</a>
  <a href="http://localhost:1337/api/connect/google" rel="noopener noreferrer">로그인</a>
</nav>

<slot />

<style>
  :global(body) {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
</style>
