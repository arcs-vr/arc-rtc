<template>
    <Suspense>
      <ParcourCanvas/>

      <template #fallback>
        <LoadingAnimation width="500px" height="500px"/>
      </template>
    </Suspense>
</template>

<script
  setup
  lang="ts"
>
import ParcourCanvas from '../components/ParcourCanvas.vue'
import LoadingAnimation from '../components/LoadingAnimation.vue'
</script>
