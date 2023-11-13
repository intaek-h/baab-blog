<!-- 
  @component
  숫자가 변할때 갓챠 애니메이션을 보여주는 컴포넌트입니다.

  참고자료: https://svelte.dev/repl/1ed2971a5b594fde94a31bfdd11cfc18?version=3.42.6
 -->

<script lang="ts">
  export let number: number
  export let lineHeight = 45
</script>

<div class="container" style="--line-height: {lineHeight}px; --offset: {-number * lineHeight}px">
  {#each Array(10) as _, i}
    <div class="digit font-serif" class:active={i == number}>{i}</div>
  {/each}
</div>

<style>
  .digit {
    transition: opacity 0.3s ease-in;
    opacity: 0.2;
  }
  .active {
    opacity: 1;
  }
  .container {
    display: inline-flex;
    flex-direction: column;
    text-align: center;

    line-height: var(--line-height);
    height: var(--line-height);
    font-size: var(--line-height);
    transform: translate(0, var(--offset));

    /* https://easings.net/#easeInOutCirc */
    transition: transform 0.5s cubic-bezier(0.85, 0, 0.15, 1);
  }
</style>
