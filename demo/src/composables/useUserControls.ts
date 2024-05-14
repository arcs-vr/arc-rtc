import { shallowRef } from 'vue'
import type { Camera } from 'three'
import { Vector3 } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { KeyboardControls } from '../tools/KeyboardControls.ts'
import { usePathfinding } from '../stores/usePathfinding.ts'
import { PLAYER_HEIGHT, TOLERANCE } from '../config.ts'
import { JoystickControls } from '../tools/JoystickControls.ts'

export async function useUserControls (camera: Camera) {
  const isLocked = shallowRef(false)
  let lookControls: PointerLockControls
  let keyboardControls: KeyboardControls
  let joystickControls: JoystickControls
  const { allowStep } = await usePathfinding()
  const copyVector = new Vector3()
  const targetOnNavMesh = camera.position.clone()
  let lowestCameraY = targetOnNavMesh.y + PLAYER_HEIGHT

  function connect (element: HTMLElement) {
    lookControls = new PointerLockControls(camera, element)
    lookControls.addEventListener('lock', () => (isLocked.value = true))
    lookControls.addEventListener('unlock', () => (isLocked.value = false))
    lookControls.connect()

    const options = { speed: 3, crouchFactor: .5, sprintFactor: 1.5, jumpForce: 5 }

    keyboardControls = new KeyboardControls(camera, element, options)
    keyboardControls.connect()

    joystickControls = new JoystickControls(camera, element, options)
    joystickControls.connect()
  }

  function dispose () {
    lookControls.dispose()
    keyboardControls.dispose()
    joystickControls.dispose()
  }

  function update (time: number, delta: number): void {
    joystickControls.updateCamera(delta)

    copyVector
      .copy(keyboardControls.velocity)
      .add(joystickControls.velocity)
      .setY(0)
      .multiplyScalar(delta)
      .applyQuaternion(camera.quaternion)
      .add(camera.position)

    // Acceleration 9.81m/s²
    // Velocity = Acceleration * Time
    // Distance = Velocity * Time
    keyboardControls.velocity.y = keyboardControls.canJump
      ? Math.max(0, keyboardControls.velocity.y) // allow jumping but not falling
      : keyboardControls.velocity.y - (9.81 * delta) // only falling

    copyVector.y = Math.max(lowestCameraY, camera.position.y + (keyboardControls.velocity.y * delta))

    if (allowStep(copyVector, targetOnNavMesh)) {
      lowestCameraY = targetOnNavMesh.y + PLAYER_HEIGHT
      camera.position.copy(copyVector)
    }

    keyboardControls.canJump = camera.position.y - lowestCameraY < TOLERANCE
  }

  function lockPointer () {
    lookControls?.lock()
  }

  return {
    isLocked,
    lockPointer,
    connect,
    dispose,
    update
  }
}
