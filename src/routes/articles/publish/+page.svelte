<script lang="ts">
  import { editor, title } from '$lib/stores/editor'
  import { me } from '$lib/stores/me'
  import { api } from '$lib/utils/fetch'
  import { onMount } from 'svelte'

  // onMount(async () => {
  //   if ($me.name) {
  //     const queries = [
  //       `filters[username][$eq]=${$me.name}`,
  //       'populate[0]=article_collections',
  //     ].join('&')

  //     const response = await api.get('/api/users?' + queries)

  //     console.log(response.data)
  //   }
  // })
</script>

<main class="m-auto w-[700px]">
  <h1 class="mb-60 text-5xl font-bold">발행 전 마지막 단계입니다.</h1>
  <div>
    <div class="stats shadow">
      <div class="stat">
        <div class="stat-title">지금까지 작성한 글 수</div>
        <div class="stat-value">4 <span class="text-xs font-normal">개</span></div>
        <div class="stat-desc">41일 만에 복귀하셨네요!</div>
      </div>
      <div class="stat">
        <div class="stat-title">지금까지 작성한 글 수</div>
        <div class="stat-value">4 <span class="text-xs font-normal">개</span></div>
        <div class="stat-desc">41일 만에 복귀하셨네요!</div>
      </div>
      <div class="stat">
        <div class="stat-title">지금까지 작성한 글 수</div>
        <div class="stat-value">4 <span class="text-xs font-normal">개</span></div>
        <div class="stat-desc">41일 만에 복귀하셨네요!</div>
      </div>
      <div class="stat">
        <div class="stat-title">지금까지 작성한 글 수</div>
        <div class="stat-value">4 <span class="text-xs font-normal">개</span></div>
        <div class="stat-desc">41일 만에 복귀하셨네요!</div>
      </div>
      <div class="stat">
        <div class="stat-title">지금까지 작성한 글 수</div>
        <div class="stat-value">4 <span class="text-xs font-normal">개</span></div>
        <div class="stat-desc">41일 만에 복귀하셨네요!</div>
      </div>
    </div>
  </div>

  <span class="text-xs">이 글을 시리즈로 발행할 수 있습니다.</span>
  <select class="select select-bordered select-xs block w-full max-w-xs">
    <option disabled selected>Tiny</option>
    <option>Tiny Apple</option>
    <option>Tiny Orange</option>
    <option>Tiny Tomato</option>
  </select>

  <span class="text-xs">제목</span>
  <p class="text-4xl font-semibold outline-none" contenteditable bind:textContent={$title}></p>

  <span class="text-xs">본문</span>
  <code class="block rounded-md border border-black bg-gray-50 p-12"
    >{$editor?.getTextContent() || ''}</code
  >
</main>
