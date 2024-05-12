import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh'
import {BufferGeometry, Mesh} from 'three'

BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
Mesh.prototype.raycast = acceleratedRaycast

BufferGeometry.prototype.hasBVH = true
Mesh.prototype.hasBVH = true
