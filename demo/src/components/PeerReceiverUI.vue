<template>
  <label for="peer-id">Peer ID</label>
  <output name="peer-id" id="peer-id">
    <img :src="qrData" alt=""/>
  </output>
</template>

<script
  setup
  lang="ts"
>
defineProps<{
  qrData: string
}>()
</script>

<style scoped>

</style>
