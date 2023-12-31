<script lang="ts">
  import { getMe } from '$lib/queries/user'
  import { createQuery } from '@tanstack/svelte-query'

  const query = createQuery({ ...getMe })
</script>

<nav class="mb-30 border-b">
  <a href="/">홈으로</a>
  <a href="/articles/write">글쓰기</a>
  {#if $query.data?.username}
    <a href={`/@${$query.data?.username}`}>마이페이지</a>
  {/if}
  <a href="http://localhost:1337/api/connect/google" rel="noopener noreferrer">로그인</a>
  <a href="/articles/publish">발행하기</a>
</nav>
