<script lang="ts">
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'
  import Dimmer from '$lib/components/common/Dimmer.svelte'
  import EditorGuide from '$lib/components/common/EditorGuide.svelte'
  import DoubleChevronRight from '$lib/components/icons/DoubleChevronRight.svelte'
  import { title } from '$lib/stores/editor'
  import { createQuery } from '@tanstack/svelte-query'
  import { getMe } from '$lib/queries/user'
  // import Logo from '/logo/lepository-icon.png'

  createQuery(getMe)
  // console.log($query.data)

  let isHelpShown = false
</script>

<div on:drop|preventDefault role="document" class="m-auto">
  <nav class="flex justify-between px-12 py-4 transition-colors">
    <a href="/"><img src="/logo/lepository-logo-s.png" class="inline max-h-24" alt="" /></a>
    <div class="flex gap-8">
      <button class="text-gray-700 hover:text-accent" on:click={() => (isHelpShown = !isHelpShown)}>
        에디터 배우기
      </button>
      <a href="/articles/publish" class="flex items-center gap-4 text-gray-700 hover:text-accent">
        발행하기
        <DoubleChevronRight width={20} />
      </a>
    </div>
  </nav>

  <div class="mb-40 w-full bg-accent">
    <input
      bind:value={$title}
      type="text"
      spellcheck="false"
      class="w-full bg-transparent text-center font-serif text-[42px] text-[white] outline-none placeholder:text-[#d4e9e2]"
      placeholder="제목"
    />
  </div>

  <ArticleEditor />

  <Dimmer show={isHelpShown} on:close={() => (isHelpShown = false)}>
    <EditorGuide />
  </Dimmer>
</div>
