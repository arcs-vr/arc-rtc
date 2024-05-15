import { Camera, Euler, Vector2, Vector3 } from 'three'
import { StickMoveEvent } from '../types.ts'
import { JOYSTICK_TYPE } from '../config.ts'

type JoystickControlsOptions = {
  speed: number,
  lookSpeed: number
}

const PI_2 = Math.PI / 2

export class JoystickControls {
  public readonly velocity: Vector3 = new Vector3(0, 0, 0)
  public readonly rotation: Vector3 = new Vector2(0, 0)

  private readonly camera: Camera
  private readonly options: JoystickControlsOptions
  private readonly domElement: HTMLElement

  /**
   * @see three/examples/jsm/controls/PointerLockControls.d.ts:5
   */
  private readonly minPolarAngle = 0 // radians
  private readonly maxPolarAngle = Math.PI // radians
  private readonly copyEuler = new Euler(0, 0, 0, 'YXZ')

  constructor (camera: Camera, domElement: HTMLElement, options: JoystickControlsOptions) {
    this.camera = camera
    this.options = options
    this.domElement = domElement
  }

  public connect () {
    this.domElement.ownerDocument.addEventListener('stickmove', this.stickListener)
  }

  public disconnect () {
    this.domElement.ownerDocument.removeEventListener('stickmove', this.stickListener)
  }

  public dispose () {
    this.disconnect()
  }

  public updateCamera (delta) {
    this.copyEuler.setFromQuaternion(this.camera.quaternion)

    this.copyEuler.x -= this.rotation.x * delta
    this.copyEuler.y -= this.rotation.y * delta

    this.copyEuler.x = Math.max(
      PI_2 - this.maxPolarAngle,
      Math.min(PI_2 - this.minPolarAngle, this.copyEuler.x)
    )

    this.camera.quaternion.setFromEuler(this.copyEuler)
  }

  private stickListener = (event: StickMoveEvent) => {
    if (event.detail[0] === JOYSTICK_TYPE.MOVE) {
      this.velocity
        .set(event.detail[1], 0, event.detail[2])
        .multiplyScalar(this.options.speed)

      return
    }

    this.rotation.x = event.detail[2] * this.options.lookSpeed
    this.rotation.y = event.detail[1] * this.options.lookSpeed
  }
}
