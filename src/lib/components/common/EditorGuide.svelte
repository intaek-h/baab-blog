<div class="flex h-full w-full flex-col justify-center gap-40 overflow-y-auto p-40">
  <section class="grid grid-cols-3 gap-16">
    <div
      class="flex min-h-[300px] flex-col items-center justify-center gap-36 rounded-lg bg-base-content p-24 text-base-200"
    >
      <p class="break-keep text-3xl font-black">첨부한 이미지를 화면 전체로 확대할 수 있습니다</p>

      <div class="flex flex-col gap-4 break-keep">
        <div class="flex items-center gap-8">
          <div class="daisy-badge daisy-badge-outline">기본</div>
          <p>글쓰기 영역 만큼</p>
        </div>
        <div class="flex items-center gap-8">
          <div class="daisy-badge daisy-badge-outline">확장</div>
          <p>글쓰기 영역 보다 조금 넓게</p>
        </div>
        <div class="flex items-center gap-8">
          <div class="daisy-badge daisy-badge-outline">채우기</div>
          <p>화면 전체 영역</p>
        </div>
      </div>
    </div>

    <div
      class="flex min-h-[300px] flex-col items-center justify-center gap-36 rounded-lg bg-base-content p-24 text-base-200"
    >
      <p class="break-keep text-3xl font-black">
        <span class="text-neutral-content">줄바꿈</span>
        과
        <span class="text-neutral-content">문단 바꿈</span>
        을 구분해서 사용하세요
      </p>

      <p class="break-keep leading-9">
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Enter</kbd>
        키를 남발하면 불필요한 문단이 생성됩니다.
        <br />
        일반적인 줄바꿈에는
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Shift</kbd>
        +
        <kbd class="daisy-kbd daisy-kbd-sm text-base-content">Enter</kbd>
        키를 사용하세요.
      </p>
    </div>

    <div
      class="flex min-h-[300px] flex-col items-center justify-center gap-36 rounded-lg bg-base-content p-24 text-base-200"
    >
      <p class="break-keep text-3xl font-black">
        글자를 <span class="editor-light">연하게</span>
        만들수 있습니다
      </p>
      <p class="break-keep">중요치 않은 글자를 연하게 처리해서 글의 가독성을 높일 수 있습니다.</p>
    </div>
  </section>

  <div class="daisy-divider daisy-divider-success my-48 text-base-200">단축키</div>

  <section class="flex justify-evenly">
    <div class="flex flex-col gap-24">
      <div
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
    </div>

    <div class="flex flex-col gap-24">
      <div
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
        class="flex w-fit cursor-default items-center gap-12 rounded-md p-16 hover:bg-base-content"
      >
        <div
          class="rounded-md bg-base-200 p-12 outline outline-2 outline-offset-2 outline-base-200"
        >
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
          <span class="text-base-200">각각 점 목록과, 숫자 목록을 만들수 있습니다.</span>
        </div>
      </div>
    </div>
  </section>
</div>
