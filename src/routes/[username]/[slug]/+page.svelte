<script lang="ts">
  export let data

  const title = data.article.articles[0].title
  const content = data.article.articles[0].html
  const createdAt = data.article.articles[0].createdAt
</script>

{#if !data || !data.article}
  <h1>404 NOT FOUND</h1>
{:else}
  <div class="flex">
    <main class="flex-1">
      <h1 class="text-3xl font-bold">{title}</h1>
      <article>{@html content}</article>
      <span>{createdAt}</span>
    </main>
    <aside class="h-auto w-[300px] bg-slate-300"></aside>
  </div>
{/if}

<style>
  article :global(p.editor-paragraph) {
    font-size: 20px;
    margin: auto;
    margin-top: 2.14em;
    width: var(--article-max-width);
    font-family: Times, NanumMyeongjo, serif;
    line-height: 1.58;
  }
  article :global(h2.editor-heading + p.editor-paragraph) {
    margin-top: 0.48em;
  }
</style>
