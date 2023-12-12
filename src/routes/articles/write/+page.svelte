<script>
  import ArticleEditor from '$lib/components/article/ArticleEditor.svelte'
  import Modal from '$lib/components/common/Modal.svelte'
  import { title } from '$lib/stores/editor'

  let isModalOpen = false

  const showModal = () => (isModalOpen = true)
</script>

<div on:drop|preventDefault role="document" class="m-auto pt-[40px]">
  <button on:click={showModal}>모달 열기</button>
  <div class="mb-40 w-full">
    <input
      bind:value={$title}
      type="text"
      spellcheck="false"
      class="w-full text-center font-serif text-[42px] text-[#000000d6] outline-none placeholder:text-[#b3b3b1]"
      placeholder="제목..."
    />
  </div>
  <ArticleEditor />
  <Modal showModal={isModalOpen}>
    <div class="background-image h-[300px] w-[300px]">
      hello
      <p>this is intaek</p>
    </div>
  </Modal>
</div>

<style>
  .background-image {
    background-image: repeating-linear-gradient(
      45deg,
      oklch(1 0 0),
      oklch(1 0 0) 13px,
      oklch(0.961151 0 0) 13px,
      oklch(0.961151 0 0) 14px
    );
  }
</style>
