<script lang="ts">
  import { fade } from 'svelte/transition'
  import { editor } from '$lib/stores/editor'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { onDestroy } from 'svelte'
  import type { CoreEditor } from '$lib/editor/core/editor'
  import RollingDigits from '$lib/components/common/RollingDigits.svelte'

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
  class="w-full blink-n-times flex flex-col justify-between px-8 py-16 relative h-[200px] my-100 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
>
  {#if isVisible}
    <div class="flex flex-col justify-center flex-1 w-full gap-16">
      <span class="text-gray-900 text-xl font-serif block w-full">
        이 글을 발행해서 얻을 수 있는 포인트
      </span>

      <!-- 그래프 영역 -->
      <div class="flex w-full items-center justify-between gap-16" in:fade>
        <dt class="text-xs flex-1">
          <div class="w-full h-20 rounded-r-full bg-slate-100">
            <div
              class="h-full rounded-r-full bg-gradient-to-r from-white to-green-600"
              style={`width: ${$graphWidth}%`}
            />
          </div>
        </dt>
        <dd class="min-w-[50px]">
          <div class="overflow-hidden inline-flex justify-center items-center">
            {#each digits as digit, i (digits.length - i)}
              <RollingDigits number={digit} lineHeight={20} />
            {/each}
          </div>
          <span class="font-serif text-xs">점</span>
        </dd>
      </div>
    </div>

    <div class="flex justify-between w-full gap-12 font-serif">
      <button
        on:click|stopPropagation={() => (isVisible = false)}
        class="hover:underline text-gray-300 italic"
      >
        가리기
      </button>
      <button on:click|stopPropagation class="hover:underline">발행하기</button>
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
