<script lang="ts">
  import { editor } from '$lib/stores/editor'
  import { get } from 'svelte/store'

  const getEditorState = () => {
    const editorRef = get(editor)
    const state = editorRef?.state.doc.toJSON()
    console.log(state)
  }
</script>

<button on:click={getEditorState}>i am a tester</button>
