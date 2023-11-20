<script lang="ts">
  import InvisiblePublishForm from '$lib/components/article/InvisiblePublishForm.svelte'
  import { CoreEditor } from '$lib/editor/core/editor'
  import { Blockquote } from '$lib/editor/extensions/blockquote'
  import { Bold } from '$lib/editor/extensions/bold'
  import { BulletList } from '$lib/editor/extensions/bulletList'
  import { FloatingMenu } from '$lib/editor/extensions/floatingMenu'
  import { Heading } from '$lib/editor/extensions/heading'
  import { HorizontalRule } from '$lib/editor/extensions/horizontalRule'
  import { Italics } from '$lib/editor/extensions/italics'
  import { Link } from '$lib/editor/extensions/link'
  import { ListItem } from '$lib/editor/extensions/listItem'
  import { OrderedList } from '$lib/editor/extensions/orderedList'
  import { editor } from '$lib/stores/editor'
  import { onDestroy, onMount } from 'svelte'

  let element: HTMLElement

  onMount(() => {
    const placeholder = '내용을 입력하세요.'

    const coreEditor = new CoreEditor({
      element,
      placeholder,
      extensions: [
        Link,
        Bold,
        Heading,
        Italics,
        Blockquote,
        ListItem,
        OrderedList,
        BulletList,
        HorizontalRule,
        FloatingMenu,
      ],
    })

    editor.set(coreEditor)

    coreEditor.on('transaction', ({ editor }) => {
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
  class="article-editor relative font-serif h-full w-full [&>.ith_p]:mt-[29px] [&>.ith_h2]:font-sans [&>.ith_h2]:text-34 [&>.ith_blockquote>h2]:text-26 [&>.ith_h2]:font-bold [&>.ith_h2]:mt-[56px] [&>.ith_a]:underline [&>.ith_blockquote]:pl-23 [&>.ith_blockquote]:shadow-[inset_3px_0_0_0_#242424] [&_.ith__hr-wrapper]:my-20 [&>.ith]:text-[21px] [&>.ith]:text-[#000000d6] [&>.ith]:outline-none [&>.ith]:h-full"
/>
<InvisiblePublishForm />

<!-- 에디터 스타일 시트로 빼기 -->
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
  /* 에디터 placeholder 스타일 */
  .article-editor :global(.ith[placeholder]:before) {
    content: attr(placeholder);
    color: #b3b3b1;
    position: absolute;
    pointer-events: none;
  }
  /* 헤딩 바로 아래 본문 스타일 */
  .article-editor :global(.ith__heading + .ith__paragraph) {
    margin-top: 8px !important;
  }
  .article-editor :global(.ith__horizontal-rule) {
    border: 0;
    height: 1px;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0)
    );
    margin-top: 58px;
    margin-bottom: 72px;
  }
  .article-editor :global(.ith__hr-wrapper) {
    padding-bottom: 10px;
    padding-top: 24px;
    cursor: pointer;
  }
  .article-editor :global(.ith__ol) {
    list-style-type: decimal;
    padding-left: 20px;
  }
  .article-editor :global(.ith__ul) {
    list-style-type: square;
    padding-left: 20px;
  }
  .article-editor :global(.ProseMirror-selectednode) {
    outline: none;
    box-shadow: 0 0 5px 2px #f3f3f3;
  }
  .article-editor :global(.ProseMirror-gapcursor) {
    display: block;
    top: -2px;
    width: 1px;
    /* Paragraph 노드의 line-height 과 동일해야 합니다. */
    height: 20px;
    background: #000;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }
  .article-editor :global(.ProseMirror-focused .ProseMirror-gapcursor) {
    display: block;
  }
  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }
</style>
