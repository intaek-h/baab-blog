<script lang="ts">
  import InvisiblePublishForm from '$lib/components/article/InvisiblePublishForm.svelte'
  import { CoreEditor } from '$lib/editor/core/editor'
  import { Blockquote } from '$lib/editor/extensions/blockquote'
  import { Bold } from '$lib/editor/extensions/bold'
  import { BulletList } from '$lib/editor/extensions/bulletList'
  import { FloatingMenu } from '$lib/editor/extensions/floatingMenu'
  import { Heading } from '$lib/editor/extensions/heading'
  import { HorizontalRule } from '$lib/editor/extensions/horizontalRule'
  import { Iframe } from '$lib/editor/extensions/iframe'
  import { Image } from '$lib/editor/extensions/image'
  import { Indicator } from '$lib/editor/extensions/indicator'
  import { Italics } from '$lib/editor/extensions/italics'
  import { Light } from '$lib/editor/extensions/light'
  import { Link } from '$lib/editor/extensions/link'
  import { ListItem } from '$lib/editor/extensions/listItem'
  import { OrderedList } from '$lib/editor/extensions/orderedList'
  import { editor } from '$lib/stores/editor'
  import type { EditorProps } from 'prosemirror-view'
  import { onDestroy, onMount } from 'svelte'

  let element: HTMLElement

  onMount(() => {
    const placeholder = '내용을 입력하세요.'

    const coreEditor = new CoreEditor({
      element,
      placeholder,
      extensions: [
        Link,
        Light,
        Bold,
        Heading,
        Italics,
        Blockquote,
        ListItem,
        OrderedList,
        BulletList,
        Iframe,
        Image,
        HorizontalRule,
        FloatingMenu,
        Indicator,
      ],
      editorProps: {
        handleDrop: onDrop,
      },
    })

    editor.set(coreEditor)

    coreEditor.on('transaction', ({ editor }) => {
      togglePlaceholder(placeholder)
    })
  })

  onDestroy(() => {
    if ($editor) {
      $editor.destroy()
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

  // @ts-ignore
  const onDrop: EditorProps['handleDrop'] = async (view, event) => {
    event.preventDefault()

    const isFileDrop = event.dataTransfer && event.dataTransfer.files.length

    if ($editor && isFileDrop) {
      const coords = { left: event.clientX, top: event.clientY }
      const indicatorId = {}
      const url = URL.createObjectURL(event.dataTransfer.files[0])

      $editor.commandManager.commands.displayUploadIndicator(indicatorId, coords)(
        view.state,
        view.dispatch,
        view
      )

      await new Promise((resolve) => setTimeout(resolve, 1000))

      $editor.commandManager.commands.insertImage([url], indicatorId)(
        view.state,
        view.dispatch,
        view
      )
    }
  }
</script>

<div
  bind:this={element}
  role="note"
  class="
    editor-parent
    relative h-full w-full font-serif
    [&>.editor]:h-full [&>.editor]:pb-40 [&>.editor]:text-[21px] [&>.editor]:text-[#000000d6] [&>.editor]:outline-none"
/>
<InvisiblePublishForm />
