<script>
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'
  import { me } from '$lib/stores/me'

  let title = ''
</script>

<nav class="h-[65px]">
  <span>{$me.name}</span>
</nav>
<div on:drop|preventDefault role="document" class="m-auto pt-[40px]">
  <div class="m-auto mb-20 w-[700px]">
    <input
      bind:value={title}
      type="text"
      spellcheck="false"
      class="w-full font-serif text-[42px] text-[#000000d6] outline-none placeholder:text-[#b3b3b1]"
      placeholder="제목..."
    />
  </div>
  <ArticleEditor />
</div>
