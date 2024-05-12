<template>
  <Suspense>
    <ParcourCanvas/>

    <template #fallback>
      <LoadingAnimation height="500px" width="500px"/>
    </template>
  </Suspense>
</template>

<script
  lang="ts"
  setup
>
import ParcourCanvas from '../components/ParcourCanvas.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
</script>
