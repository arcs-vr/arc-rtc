import {nextTick, onBeforeUnmount, onMounted, Ref, shallowRef} from 'vue'
import type {Camera} from 'three'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import {KeyboardControls} from '../tools/KeyboardControls.ts'
import type {Pathfinding} from 'three-pathfinding'

export function useUserControls(camera: Camera, root: Ref<HTMLElement>, pathfinding: Pathfinding) {
    const isLocked = shallowRef(false)
    const lookControls = shallowRef<PointerLockControls>()
    const moveControls = shallowRef<KeyboardControls>()

    onMounted(async () => {
        await nextTick()

        lookControls.value = new PointerLockControls(camera, root.value)
        lookControls.value.addEventListener('lock', () => (isLocked.value = true))
        lookControls.value.addEventListener('unlock', () => (isLocked.value = false))
        lookControls.value.connect()

        moveControls.value = new KeyboardControls(
            camera,
            root.value,
            {speed: 3, crouchFactor: .5, sprintFactor: 1.5},
            pathfinding,
        )
    })

    onBeforeUnmount(() => {
        lookControls.value?.dispose()
    })

    return {
        isLocked,
        lookControls,
        moveControls,
    }
}
