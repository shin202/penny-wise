<script setup lang="ts">
import Button from 'primevue/button'
</script>

<template>
  <section class="not-found">
    <div class="not-found__inner">
      <p class="glitch text-4xl">
        <span aria-hidden="true">Oops</span>
        Oops
        <span aria-hidden="true">Oops</span>
      </p>
      <p class="glitch text-8xl">
        <span aria-hidden="true">404</span>
        404
        <span aria-hidden="true">404</span>
      </p>
      <p class="glitch">
        <span aria-hidden="true">Page not found</span>
        Page not found
        <span aria-hidden="true">Page not found</span>
      </p>
      <p class="glitch">
        <span aria-hidden="true">Look like you're lost :(</span>
        Look like you're lost :(
        <span aria-hidden="true">Look like you're lost :(</span>
      </p>
      <RouterLink to="/">
        <Button icon="pi pi-arrow-left" label="Go back home" text />
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @apply flex flex-col space-y-4 justify-center items-center select-none w-screen h-screen bg-surface-900 text-center text-surface-0;

  &__inner {
    @apply flex flex-col space-y-4 justify-center items-center;
  }

  .glitch {
    @apply font-bold uppercase relative;
    text-shadow:
      0.05em 0 0 #00fffc,
      -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
    animation: glitch 725ms infinite;

    &:nth-child(1) {
      @apply text-2xl md:text-5xl;
    }

    &:nth-child(2) {
      @apply text-6xl md:text-9xl;
    }

    &:nth-child(3) {
      @apply text-2xl md:text-5xl;
    }

    &:nth-child(4) {
      @apply text-3xl md:text-6xl;
    }

    & > span {
      @apply absolute top-0 left-0;

      &:first-child {
        animation: glitch 500ms infinite;
        clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        transform: translate(-0.04em, -0.03em);
        opacity: 0.75;
      }

      &:last-child {
        animation: glitch 375ms infinite;
        clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
        transform: translate(0.04em, 0.03em);
        opacity: 0.75;
      }
    }
  }
}

@keyframes glitch {
  0% {
    text-shadow:
      0.05em 0 0 #00fffc,
      -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow:
      0.05em 0 0 #00fffc,
      -0.03em -0.04em 0 #fc00ff,
      0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow:
      -0.05em -0.025em 0 #00fffc,
      0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow:
      -0.05em -0.025em 0 #00fffc,
      0.025em 0.035em 0 #fc00ff,
      -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow:
      0.05em 0.035em 0 #00fffc,
      0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow:
      0.05em 0.035em 0 #00fffc,
      0.03em 0 0 #fc00ff,
      0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow:
      -0.05em 0 0 #00fffc,
      -0.025em -0.04em 0 #fc00ff,
      -0.04em -0.025em 0 #fffc00;
  }
}
</style>
