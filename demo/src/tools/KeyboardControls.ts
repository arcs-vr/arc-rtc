import {Camera, Vector3} from 'three'
import type {Pathfinding} from 'three-pathfinding'

export type ControlsOptions = {
    sprintFactor: number,
    crouchFactor: number,
    speed: number
}

export class KeyboardControls {
    public readonly velocity: Vector3 = new Vector3(0, 0, 0)
    private readonly copyVector: Vector3 = new Vector3()

    private appliedSpeedFactor: number = 1

    private readonly keys: Set<string> = new Set()

    private readonly options: ControlsOptions
    private readonly camera: Camera
    private readonly domElement: HTMLElement
    private readonly pathfinding: Pathfinding

    constructor(camera: Camera, domElement: HTMLElement, options: ControlsOptions, pathfinding: Pathfinding) {
        this.camera = camera
        this.options = options
        this.domElement = domElement
        this.pathfinding = pathfinding
    }

    public start() {
        this.keys.clear()
        this.domElement.ownerDocument.addEventListener('keydown', this.keyListener)
        this.domElement.ownerDocument.addEventListener('keyup', this.keyListener)
    }

    public stop() {
        this.domElement.ownerDocument.removeEventListener('keydown', this.keyListener)
        this.domElement.ownerDocument.removeEventListener('keyup', this.keyListener)
        this.keys.clear()
    }

    public isVelocityActive() {
        return this.keys.size !== 0
    }

    public update(time: number, delta: number): void {
        if (!this.camera) {
            return
        }

        this.copyVector
            .copy(this.velocity)
            .multiplyScalar(delta)
            .applyQuaternion(this.camera.quaternion)
            .setY(0)

        this.pathfinding.clampStep(
            this.camera.position,
            this.copyVector,
            'level1',
            undefined,
            undefined,
            this.copyVector,
        )

        this.camera.position.add(this.copyVector)
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
                break
            case 'keyup':
                this.keys.delete(lowercaseKey)
                break
        }

        this.applyFactors()
        this.updateVelocity()
    }

    private updateVelocity() {
        this.setAxisVelocity('x', ['keyd', 'arrowright'], ['keya', 'arrowleft'])
        this.setAxisVelocity('z', ['keys', 'arrowdown'], ['keyw', 'arrowup'])
        this.velocity.multiplyScalar(this.appliedSpeedFactor)
    }

    private applyFactors() {
        if (this.keys.has('shiftleft')) {
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
