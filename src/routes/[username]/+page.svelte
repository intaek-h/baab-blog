<script lang="ts">
  export let data

  const user = data.user && data.user[0]
  console.log(user)
</script>

{#if !user}
  <h1>404 NOT FOUND</h1>
{:else}
  <h1 class="text-3xl font-bold">{user.username}</h1>

  <ul class="my-24">
    {#each user.articles as article (article.id)}
      <li class="my-12 border">
        <a class="block" href={`/@${user.username}/${article.slug}`}>
          <span>{article.title}</span>
          <p>{article.preview}</p>
          <span>{article.createdAt}</span>
        </a>
      </li>
    {/each}
  </ul>
{/if}
