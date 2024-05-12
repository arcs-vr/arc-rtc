import {shallowRef, ShallowRef, watchEffect} from 'vue'
import QRCode from 'qrcode'

export function useQRCode(
    text: ShallowRef<string>,
    options?: QRCode.QRCodeToDataURLOptions,
) {
    const result = shallowRef<string | undefined>(undefined)

    watchEffect(
        async () => {
            if (text.value) {
                result.value = text.value ? await QRCode.toDataURL(text.value, options) : undefined
            }
        },
    )

    return result
}
