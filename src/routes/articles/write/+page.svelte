<script>
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'

  let title = ''
</script>

<nav class="h-[65px]">
  <!-- <a href="/">홈으로</a> -->
  <!-- <a href="/">발행</a> -->
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
