<script lang="ts">
  import InvisiblePublishForm from '$lib/components/article/InvisiblePublishForm.svelte'
  import { CoreEditor } from '$lib/editor/core/editor'
  import { Bold } from '$lib/editor/extensions/bold'
  import { FloatingMenu } from '$lib/editor/extensions/floatingMenu'
  import { Heading } from '$lib/editor/extensions/heading/heading'
  import { Italics } from '$lib/editor/extensions/italics'
  import { Link } from '$lib/editor/extensions/link/link'
  import { editor } from '$lib/stores/editor'
  import { onDestroy, onMount } from 'svelte'

  let element: HTMLElement

  onMount(() => {
    const placeholder = '내용을 입력하세요.'

    const coreEditor = new CoreEditor({
      element,
      extensions: [Link, Bold, Heading, Italics, FloatingMenu],
      placeholder,
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
          placeholder: placeholder,
        },
      })
    }

    if (currentPlaceholder !== '') {
      return $editor.view.setProps({
        attributes: {
          ...$editor.view.props.attributes,
          placeholder: '',
        },
      })
    }
  }
</script>

<div
  bind:this={element}
  class="article-editor relative font-serif h-full w-full [&>.ith>p]:mt-[29px] [&>.ith>h2]:font-sans [&>.ith>h2]:text-[34px] [&>.ith>h2]:font-bold [&>.ith>h2]:mt-[56px] [&>.ith_a]:underline [&>.ith]:text-[21px] [&>.ith]:text-[#000000d6] [&>.ith]:outline-none [&>.ith]:h-full"
/>
<InvisiblePublishForm />

<style>
  /* 플로팅 메뉴를 위한 스타일 코드입니다. */
  .article-editor :global(.ith__floating-menu) {
    position: absolute;
    background-color: #74cbd5;
    width: fit-content;
    gap: 8px;
    padding: 0 2px;
  }
  .article-editor :global(.ith__floating-menu__arrow) {
    width: 8px;
    height: 8px;
    background: #000;
    position: absolute;
    bottom: 0;
    background-color: #74cbd5;
    left: 50%;
    transform: translateX(-50%) translateY(50%) rotate(45deg);
  }
  .article-editor :global(.ith__floating-menu button) {
    border: none;
    background-color: transparent;
    cursor: pointer;
    word-break: keep-all;
  }
  .article-editor :global(.ith__floating-menu button:hover) {
    text-decoration: underline;
  }
  .article-editor :global(.ith__floating-menu__paragraph) {
    margin-right: 8px;
  }
  /* 에디터 placeholder 스타일을 위한 코드입니다. */
  .article-editor :global(.ith[placeholder]:before) {
    content: attr(placeholder);
    color: #b3b3b1;
    position: absolute;
    pointer-events: none;
  }
</style>
