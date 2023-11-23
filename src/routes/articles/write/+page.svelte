<script>
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'

  let title = ''
</script>

<nav class="h-[65px]">
  <!-- <a href="/">홈으로</a> -->
  <!-- <a href="/">발행</a> -->
</nav>
<div on:drop|preventDefault role="document" class="m-auto w-[700px] pt-[40px]">
  <div class="mb-20">
    <input
      bind:value={title}
      type="text"
      class="font-serif text-[42px] text-[#000000d6] outline-none placeholder:text-[#b3b3b1]"
      placeholder="제목..."
    />
  </div>
  <ArticleEditor />
</div>
