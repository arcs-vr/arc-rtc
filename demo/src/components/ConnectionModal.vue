<template>
  <div class="ConnectionModal">
    <h1>Connect</h1>
    <p>You can use a smartphone or other touch device as a gamepad.</p>
    <p>Click the button below to generate your secret ID and connect to your other device.</p>

    <span><em>Status:</em> {{ status }}</span>

    <div class="ConnectionModal__qr">
      <p>Scan the QR Code with your smartphone's or tablet's camera app or a QR scanner app.</p>
      <p>It will open a gamepad controller directly connected to this 3D parcour.</p>

      <label for="peer-id">QR Code</label>
      <output
        id="peer-id"
        name="peer-id"
      >
        <img
          :src="qrData"
          alt=""
        />
      </output>
    </div>

    <button
      class="ConnectionModal__close"
      title="Close"
      type="button"
      @click="emit('close')"
    >&times;
    </button>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { PEER_STATUS } from '../config.ts'

defineProps<{
  qrData: string
  status: PEER_STATUS
}>()

const emit = defineEmits<{
  connect: []
  close: []
}>()
</script>

<style
  lang="scss"
  scoped
>
.ConnectionModal {
  align-items: center;
  background-color: var(--color-dark);
  color: var(--color-light);
  display: flex;
  flex-flow: column nowrap;
  gap: var(--spacer-5);
  inset: 0;
  justify-content: center;
  padding: var(--spacer-5);
  position: fixed;
  text-align: center;
  z-indeX: 100;

  &__qr {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--spacer-3);
  }

  &__close {
    font-size: 2rem;
    position: absolute;
    right: var(--spacer);
    top: var(--spacer);
  }
}
</style>
