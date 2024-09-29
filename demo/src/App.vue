<template>
  <main
    :data-show="isLogoPlaced"
    class="ArcRTC"
  >
    <Transition name="fade">
      <LoadingAnimation
        v-if="!isLoaded"
        ref="logo"
        class="ArcRTC__logo"
      />
    </Transition>

    <RouterView v-slot="{ Component }">
      <Component
        :is="Component"
        @loaded="isLoaded = true"
      />
    </RouterView>
  </main>
</template>

<style
  lang="scss"
  scoped
>
.ArcRTC {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
  opacity: 0;

  &[data-show="true"] {
    opacity: 100%;
  }

  &__logo {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
  }
}
</style>

<script
  lang="ts"
  setup
>
import LoadingAnimation from './components/LoadingAnimation.vue'
import { useRouter } from 'vue-router'
import { ComponentPublicInstance, nextTick, shallowRef } from 'vue'
import { useResizeListener } from './composables/useResizeListener.ts'

const { afterEach } = useRouter()

const logo = shallowRef<ComponentPublicInstance<typeof LoadingAnimation>>()
const isLogoPlaced = shallowRef(false)
const isLoaded = shallowRef(false)

afterEach(async () => {
  await nextTick()
  updateLogo(!isLogoPlaced.value)
})

useResizeListener(() => {
  updateLogo(true)
})

function updateLogo (instant?: boolean) {
  const target = document.querySelector('[data-logo-target]')

  if (target) {
    const rect = target.getBoundingClientRect()

    if (instant) {
      logo.value.$el.setAttribute('style', `top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px; left: ${rect.left}px; transform: translate(0, 0);`)
      isLogoPlaced.value = true
      return
    }

    logo.value.$el.animate(
      [
        {
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        },
      ],
      {
        // timing options
        duration: 300,
        fill: 'forwards',
        easing: 'ease-in-out',
      }
    )
  }
}
</script>
