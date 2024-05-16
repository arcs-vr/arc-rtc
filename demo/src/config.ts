export const PLAYER_HEIGHT = 1.7
export const TOLERANCE = 0.001

export enum JOYSTICK_TYPE {
  MOVE,
  LOOK
}

/**
 * If there was no joystick event for this amount of time, clear all joystick inputs.
 * This is to prevent perpetual movement when the connectivity is bad.
 */
export const JOYSTICK_HEARTBEAT_TIMEOUT = 2_000

export enum PEER_STATUS {
  NOT_CONNECTED = 'not connected',
  READY_TO_CONNECT = 'ready to connect',
  CONNECTED = 'connected',
}

export const eventIdToName = new Map<number, string>([
  [0, 'stickmove'],
  [1, 'primary'],
  [2, 'secondary'],
])

export const eventNameToId = new Map<string, number>(
  Array
    .from(eventIdToName.entries())
    .map(entry => entry.reverse())
)
