import { JOYSTICK_TYPE } from './config.ts'

export type Vector3Params = number[]

export type StickMoveEvent = CustomEvent<[JOYSTICK_TYPE, number, number]>
export type ButtonPushEvent = CustomEvent<undefined>

declare global {

  interface WindowEventHandlersEventMap {
    'stickmove': StickMoveEvent
    'primary': ButtonPushEvent
    'secondary': ButtonPushEvent
  }
}
