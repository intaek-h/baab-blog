<script lang="ts">
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'
  import Dimmer from '$lib/components/common/Dimmer.svelte'
  import EditorGuide from '$lib/components/common/EditorGuide.svelte'
  import DoubleChevronRight from '$lib/components/icons/DoubleChevronRight.svelte'
  import { title } from '$lib/stores/editor'

  let isHelpShown = true
</script>

<div on:drop|preventDefault role="document" class="m-auto">
  <nav class="flex justify-end gap-8 px-12 py-4 transition-colors">
    <button class="text-gray-700 hover:text-blue-700" on:click={() => (isHelpShown = !isHelpShown)}>
      에디터 배우기
    </button>
    <a href="/articles/publish" class="flex items-center gap-4 text-gray-700 hover:text-blue-700">
      발행하기
      <DoubleChevronRight width={20} />
    </a>
  </nav>
  <div class="mb-40 w-full bg-black">
    <input
      bind:value={$title}
      type="text"
      spellcheck="false"
      class="w-full bg-transparent text-center font-serif text-[42px] text-[white] outline-none placeholder:text-[#b3b3b1]"
      placeholder="제목"
    />
  </div>
  <ArticleEditor />
  <Dimmer show={isHelpShown} on:close={() => (isHelpShown = false)}>
    <EditorGuide />
  </Dimmer>
</div>
