import { JOYSTICK_TYPE } from './config.ts'

export type Vector3Params = [x: number, y: number, z: number]

export type StickMoveEvent = CustomEvent<[JOYSTICK_TYPE, number, number]>
export type ButtonPushEvent = CustomEvent<undefined>
