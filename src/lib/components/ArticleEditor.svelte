<script lang="ts">
  import { CoreEditor } from '$lib/editor/core/editor'
  import { Link } from '$lib/editor/extensions/link/link'
  import { editor } from '$lib/stores/editor'
  import { onDestroy, onMount } from 'svelte'

  let element: HTMLElement

  onMount(() => {
    const placeholder = '내용을 입력하세요.'

    const coreEditor = new CoreEditor({
      element,
      extensions: [Link],
      placeholder
    })

    editor.set(coreEditor)

    coreEditor.on('transaction', () => {
      togglePlaceholder(placeholder)
    })
  })

  onDestroy(() => {
    if ($editor) {
      $editor.destroy()
      editor.set(undefined)
    }
  })

  const togglePlaceholder = (placeholder: string = '') => {
    if (!$editor) return
    // @ts-ignore
    // MARK: props.attributes.placeholder 참조가 안되서 ts-ignore 사용했습니다.
    const currentPlaceholder = $editor.view.props.attributes['placeholder']
    const nodeSize = $editor.view.state.doc.nodeSize

    // INFO: nodeSize 가 4 이면 아무것도 작성하지 않은 상태입니다.
    if (nodeSize === 4) {
      return $editor.view.setProps({
        attributes: {
          ...$editor.view.props.attributes,
          placeholder: placeholder
        }
      })
    }

    if (currentPlaceholder !== '') {
      return $editor.view.setProps({
        attributes: {
          ...$editor.view.props.attributes,
          placeholder: ''
        }
      })
    }
  }
</script>

<div
  bind:this={element}
  class="font-serif h-full w-full [&>.ith>p]:mt-[29px] [&>.ith]:text-[21px] [&>.ith]:text-[#000000d6] [&>.ith]:outline-none [&>.ith]:h-full"
/>

<style>
  /* 에디터 placeholder 스타일을 위한 코드입니다. */
  :global(.ith[placeholder]:before) {
    content: attr(placeholder);
    color: #b3b3b1;
    position: absolute;
    pointer-events: none;
  }
</style>
