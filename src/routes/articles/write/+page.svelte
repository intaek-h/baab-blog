<script>
  import ArticleEditor from '$lib/components/ArticleEditor.svelte'

  let title = ''
</script>

<nav class="h-[65px]">
  <a href="/">홈으로</a>
  <a href="/">발행</a>
</nav>
<div class="w-[700px] m-auto pt-[40px]">
  <div class="mb-20">
    <input
      bind:value={title}
      type="text"
      class="font-serif text-[42px] text-[#000000d6] placeholder:text-[#b3b3b1] outline-none"
      placeholder="제목..."
    />
  </div>
  <ArticleEditor />
</div>
