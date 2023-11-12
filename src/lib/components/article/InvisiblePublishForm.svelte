<script lang="ts">
  import { fade } from 'svelte/transition'
  import { editor } from '$lib/stores/editor'
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'
  import { get } from 'svelte/store'

  const getEditorState = () => {
    const editorRef = get(editor)
    const state = editorRef?.state.doc.toJSON()
    console.log(state)
  }

  let visible = false
  let width = tweened(0, {
    duration: 300,
    easing: cubicOut,
  })

  $: visible ? width.set(40) : width.set(0)
</script>

<!-- 첫 마운트 시 깜빡 거리게하기 -->
<button
  on:click={() => (visible = !visible)}
  aria-describedby="이 버튼을 누르면 발행하기 버튼을 화면에 표시할 수 있습니다."
  class="w-full flex flex-col justify-between px-8 py-16 relative h-[200px] mt-30 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
>
  {#if visible}
    <div class="flex flex-col justify-center flex-1 w-full gap-16">
      <span class="text-gray-900 text-xl font-serif block w-full">
        이 글을 발행해서 얻을 수 있는 포인트
      </span>

      <div class="flex w-full items-center justify-between gap-16" in:fade>
        <dt class="text-xs flex-1">
          <div class="w-full h-20 rounded-r-full bg-slate-100">
            <div
              class="h-full rounded-r-full bg-gradient-to-r from-white to-green-600"
              style={`width: ${$width}%`}
            />
          </div>
        </dt>
        <dd>
          <span class="font-serif font-semibold text-xl">342 점</span>
        </dd>
      </div>
    </div>

    <div class="flex justify-center w-full font-serif">
      <button on:click|stopPropagation class="hover:underline">발행하기</button>
    </div>
  {/if}
</button>
