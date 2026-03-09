import { Ref, shallowRef, watchEffect } from 'vue'
import { type QRCodeToDataURLOptions, toDataURL } from 'qrcode'

export function useQRCode (
  text: Ref<string>,
  options?: QRCodeToDataURLOptions,
) {
  const result = shallowRef<string | undefined>(undefined)

  watchEffect(
    async () => {
      if (text.value) {
        result.value = text.value ? (await toDataURL(text.value, options)) : undefined
      }
    },
  )

  return result
}
