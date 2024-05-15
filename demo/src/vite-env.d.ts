/// <reference types="vite/client" />

import { ButtonPushEvent, StickMoveEvent } from './types.ts'
import type { computeBoundsTree, disposeBoundsTree, MeshBVH } from 'three-mesh-bvh'

declare global {

  interface WindowEventHandlersEventMap {
    'stickmove': StickMoveEvent
    'primary': ButtonPushEvent
    'secondary': ButtonPushEvent
  }

  interface DocumentEventMap {
    'stickmove': StickMoveEvent
    'primary': ButtonPushEvent
    'secondary': ButtonPushEvent
  }
}

declare module 'three' {
  export interface BufferGeometry {
    boundsTree?: MeshBVH;
    computeBoundsTree: typeof computeBoundsTree;
    disposeBoundsTree: typeof disposeBoundsTree;
  }
}

declare module 'three' {
  export interface Raycaster {
    firstHitOnly?: boolean;
  }
}
