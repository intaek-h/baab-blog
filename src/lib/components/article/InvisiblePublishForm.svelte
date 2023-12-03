<script lang="ts">
  import { fade } from 'svelte/transition'
  import { editor, title } from '$lib/stores/editor'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { onDestroy } from 'svelte'
  import type { CoreEditor } from '$lib/editor/core/editor'
  import RollingDigits from '$lib/components/common/RollingDigits.svelte'
  import { api } from '$lib/utils/fetch'
  import { me } from '$lib/stores/me'

  let graphWidth = tweened(0, {
    duration: 300,
    easing: cubicOut,
  })

  let isVisible = false
  let contentLength = $editor?.getTextContent().length || 0
  let digits: number[] = []

  const getContentLength = ({ editor }: { editor: CoreEditor }) => {
    contentLength = editor.getTextContent().length
  }

  const publishArticle = async () => {
    const response = await api.post('/api/articles', {
      data: {
        title: $title,
        content: $editor?.state.toJSON(),
        preview: $editor?.getTextContent().slice(0, 100),
        html: $editor?.serialize(),
        slug: $title.replace(/\s/g, '-'),
        author: {
          connect: [{ id: $me.id }],
        },
      },
    })
    console.log(response.data)
  }

  onDestroy(() => {
    $editor?.off('transaction', getContentLength)
  })

  $: if ($editor) {
    $editor.on('transaction', getContentLength)
  }

  $: if (isVisible) {
    graphWidth.set(40)
    digits = contentLength.toString().split('').map(Number)
  } else {
    graphWidth.set(0)
    digits = []
  }
</script>

<button
  on:click={() => (isVisible = !isVisible)}
  aria-describedby="이 버튼을 누르면 발행하기 버튼을 화면에 표시할 수 있습니다."
  class="blink-n-times relative my-100 flex h-[200px] w-full cursor-pointer flex-col justify-between bg-white px-8 py-16 transition-colors hover:bg-gray-50"
>
  {#if isVisible}
    <div class="flex w-full flex-1 flex-col justify-center gap-16">
      <span class="block w-full font-serif text-xl text-gray-900">
        이 글을 발행해서 얻을 수 있는 포인트
      </span>

      <!-- 그래프 영역 -->
      <div class="flex w-full items-center justify-between gap-16" in:fade>
        <dt class="flex-1 text-xs">
          <div class="h-20 w-full rounded-r-full bg-slate-100">
            <div
              class="h-full rounded-r-full bg-gradient-to-r from-white to-green-600"
              style={`width: ${$graphWidth}%`}
            />
          </div>
        </dt>
        <dd class="min-w-[50px]">
          <div class="inline-flex items-center justify-center overflow-hidden">
            {#each digits as digit, i (digits.length - i)}
              <RollingDigits number={digit} lineHeight={20} />
            {/each}
          </div>
          <span class="font-serif text-xs">점</span>
        </dd>
      </div>
    </div>

    <div class="flex w-full justify-between gap-12 font-serif">
      <button
        on:click|stopPropagation={() => (isVisible = false)}
        class="italic text-gray-300 hover:underline"
      >
        가리기
      </button>
      <button on:click|stopPropagation={publishArticle} class="hover:underline">발행하기</button>
      <span class="invisible">황인택</span>
    </div>
  {/if}
</button>

<style>
  /* 투명한 영역이 존재함을 알려주는 깜빡임 코드입니다. */
  .blink-n-times {
    animation: blinker 0.7s linear 3;
  }

  @keyframes blinker {
    50% {
      background-color: rgb(249 250 251);
    }
  }
</style>
