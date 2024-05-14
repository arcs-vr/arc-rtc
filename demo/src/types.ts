import { JOYSTICK_TYPE } from './config.ts'

export type Vector3Params = number[]

export type StickMoveEvent = CustomEvent<[JOYSTICK_TYPE, number, number]>

declare global {

  interface WindowEventHandlersEventMap {
    'stickmove': StickMoveEvent
  }
}
