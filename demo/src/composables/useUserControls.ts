import { nextTick, onBeforeUnmount, onMounted, Ref, shallowRef } from 'vue'
import type { Camera } from 'three'
import { Vector3 } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { KeyboardControls } from '../tools/KeyboardControls.ts'
import { usePathfinding } from './usePathfinding.ts'
import { PLAYER_HEIGHT, TOLERANCE } from '../config.ts'

export function useUserControls (camera: Camera, root: Ref<HTMLElement>) {
  const isLocked = shallowRef(false)
  const lookControls = shallowRef<PointerLockControls>()
  const moveControls = shallowRef<KeyboardControls>()
  const { allowStep } = usePathfinding()
  const copyVector = new Vector3()
  const targetOnNavMesh = new Vector3()

  onMounted(async () => {
    await nextTick()

    lookControls.value = new PointerLockControls(camera, root.value)
    lookControls.value.addEventListener('lock', () => (isLocked.value = true))
    lookControls.value.addEventListener('unlock', () => (isLocked.value = false))
    lookControls.value.connect()

    moveControls.value = new KeyboardControls(
      camera,
      root.value,
      { speed: 3, crouchFactor: .5, sprintFactor: 1.5, jumpForce: 5 },
      PLAYER_HEIGHT
    )
  })

  onBeforeUnmount(() => {
    lookControls.value.dispose()
    moveControls.value.stop()
  })

  function update (time: number, delta: number): void {

    copyVector
      .copy(moveControls.value.velocity)
      .setY(0) // only do it for x/z axes
      .multiplyScalar(delta)
      .applyQuaternion(camera.quaternion)
      .add(camera.position)

    // Acceleration 9.81m/s²
    // Velocity = Acceleration * Time
    // Distance = Velocity * Time
    moveControls.value.velocity.y = moveControls.value.velocity.y - (9.81 * delta)
    copyVector.y = Math.max(PLAYER_HEIGHT, camera.position.y + (moveControls.value.velocity.y * delta))

    if (allowStep(copyVector, targetOnNavMesh)) {
      camera.position.copy(copyVector)
    }

    moveControls.value.canJump = camera.position.y - PLAYER_HEIGHT - targetOnNavMesh.y < TOLERANCE
  }

  return {
    isLocked,
    lookControls,
    moveControls,
    update
  }
}
