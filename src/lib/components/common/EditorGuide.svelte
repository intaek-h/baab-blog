<script lang="ts">
</script>

<div class="h-full w-full p-40">
  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">머릿말</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">#</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">스페이스바</kbd>
      </p>
      <span class="text-base-200">반드시 문단의 맨 앞에서 실행해야 합니다.</span>
    </div>
  </div>

  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">인용구</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">{'>'}</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">스페이스바</kbd>
      </p>
      <span class="text-base-200">반드시 문단의 맨 앞에서 실행해야 합니다.</span>
    </div>
  </div>

  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">구분선</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">-</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">-</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">-</kbd>
      </p>
      <span class="text-base-200">반드시 문단의 맨 앞에서 실행해야 합니다.</span>
    </div>
  </div>

  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">줄바꿈</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">Shift</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">Enter</kbd>
      </p>
      <span class="text-base-200">같은 문단에서 줄을 바꿉니다.</span>
    </div>
  </div>

  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">문단 바꿈</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">Enter</kbd>
      </p>
      <span class="text-base-200">새로운 문단을 생성합니다.</span>
    </div>
  </div>

  <div
    class="m-auto flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
  >
    <div class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200">
      <span class="text-lg font-bold">목록 만들기</span>
    </div>
    <div class="flex flex-col items-start gap-4">
      <p>
        <kbd class="daisy-kbd daisy-kbd-sm">-</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">스페이스바</kbd>
        <span class="text-base-200">또는</span>
        <kbd class="daisy-kbd daisy-kbd-sm">1.</kbd>
        <kbd class="daisy-kbd daisy-kbd-sm">스페이스바</kbd>
      </p>
      <span class="text-base-200">새로운 문단을 생성합니다.</span>
    </div>
  </div>

  <div class="daisy-divider daisy-divider-success text-base-200">글 쓰기 팁</div>

  <section class="grid grid-cols-3 gap-16">
    <div class="bg-base-content text-base-200">
      <p>줄바꿈과 문단바꿈을 구분해서 사용하세요</p>

      <div>
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Enter</kbd>
        키를 남발하면 불필요한 문단이 생성됩니다.
        <br />
        일반적인 줄바꿈에는
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Shift</kbd>
        +
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Enter</kbd>
        키를 사용하세요.
      </div>
    </div>

    <div class="bg-base-content text-base-200">
      <p>첨부한 이미지를 화면 전체로 확대할 수 있습니다</p>
      <div>
        <div class="daisy-badge daisy-badge-outline">기본</div>
        <span>글쓰기 영역 만큼 넓게</span>
      </div>
      <div>
        <div class="daisy-badge daisy-badge-outline">확장</div>
        <span>글쓰기 영역 보다 조금 넓게</span>
      </div>
      <div>
        <div class="daisy-badge daisy-badge-outline">채우기</div>
        <span>화면 전체를 채우게</span>
      </div>
    </div>

    <div class="bg-base-content text-base-200">
      <p>글자를 연하게 만들수 있습니다</p>
      <div>중요치 않은 글자를 연하게 처리해서 글의 가독성을 높일 수 있습니다.</div>
    </div>
  </section>
</div>
