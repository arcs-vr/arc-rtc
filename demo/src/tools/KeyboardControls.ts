import { Camera, Vector3 } from 'three'

export type KeyboardControlsOptions = {
  sprintFactor: number
  crouchFactor: number
  speed: number
  jumpForce: number
}

export class KeyboardControls {
  public readonly velocity: Vector3 = new Vector3(0, 0, 0)

  private appliedSpeedFactor: number = 1

  private readonly keys: Set<string> = new Set()

  private readonly options: KeyboardControlsOptions
  private readonly camera: Camera
  private readonly domElement: HTMLElement

  private canJump: boolean

  constructor (camera: Camera, domElement: HTMLElement, options: KeyboardControlsOptions) {
    this.camera = camera
    this.options = options
    this.domElement = domElement
  }

  public connect () {
    this.keys.clear()
    this.domElement.ownerDocument.addEventListener('keydown', this.keyListener)
    this.domElement.ownerDocument.addEventListener('keyup', this.keyListener)
  }

  public disconnect () {
    this.domElement.ownerDocument.removeEventListener('keydown', this.keyListener)
    this.domElement.ownerDocument.removeEventListener('keyup', this.keyListener)
    this.keys.clear()
  }

  public dispose () {
    this.disconnect()
  }

  /**
   * Handle local and remote keyboard events
   */
  private keyListener = (event: KeyboardEvent) => {
    if (event.repeat) {
      return
    }

    const lowercaseKey = event.code.toLowerCase()
    switch (event.type) {
      case 'keydown':
        this.keys.add(lowercaseKey)

        if (lowercaseKey === 'space') {
          this.jump()
        }
        break
      case 'keyup':
        this.keys.delete(lowercaseKey)
        break
    }

    this.applyFactors()
    this.updateVelocity()
  }

  private jump () {
    if (this.canJump) {
      this.velocity.y = this.options.jumpForce
    }
  }

  private updateVelocity () {
    this.setAxisVelocity('x', ['keyd', 'arrowright'], ['keya', 'arrowleft'])
    this.setAxisVelocity('z', ['keys', 'arrowdown'], ['keyw', 'arrowup'])
    this.velocity.multiply({ x: this.appliedSpeedFactor, y: 1, z: this.appliedSpeedFactor })
  }

  private applyFactors () {
    if (this.keys.has('shiftleft') || this.keys.has('shiftright')) {
      this.appliedSpeedFactor = this.options.sprintFactor * this.options.speed
      return
    }

    if (this.keys.has('keyc')) {
      this.appliedSpeedFactor = this.options.crouchFactor * this.options.speed
      return
    }

    this.appliedSpeedFactor = this.options.speed
  }

  /**
   * Calculate the velocity for one axis based on two keys
   */
  private setAxisVelocity = (
    axis: 'x' | 'y' | 'z',
    positiveMovementKeys: string[],
    negativeMovementKeys: string[],
  ) => {
    const hasNegative = negativeMovementKeys.some(value => this.keys.has(value))
    const hasPositive = positiveMovementKeys.some(value => this.keys.has(value))

    if (hasNegative === hasPositive) {
      this.velocity[axis] = 0
      return
    }

    this.velocity[axis] = hasNegative ? -1 : 1
  }
}
