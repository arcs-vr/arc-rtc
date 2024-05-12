<template>
  <label for="peer-id">Peer ID</label>
  <output id="peer-id" name="peer-id">
    <img :src="qrData" alt=""/>
  </output>
</template>

<script
  lang="ts"
  setup
>
defineProps<{
  qrData: string
}>()
</script>

<style scoped>

</style>
