import { Material, Mesh, Raycaster, Vector3 } from 'three'
import { TOLERANCE } from '../config.ts'
import { CompressedGLTFLoader } from '../tools/CompressedGTLFLoader.ts'
import roomsNavMeshUrl from '../assets/models/numbers/nav_mesh.gltf?url'

let navMeshes: Mesh[]
let materialWalkable: Material

const raycaster = new Raycaster(undefined, undefined, 0, 24)
raycaster.firstHitOnly = true

const down = new Vector3(0, -1, 0)
const intersections = []

/**
 * Target is next player body position at feet
 */
function allowStep (target: Vector3, pointOnMesh: Vector3) {
  raycaster.set(target, down)
  intersections.length = 0

  raycaster.intersectObjects(navMeshes, false, intersections)
  if (intersections.length === 0) {
    return false
  }

  if (intersections[0].object.material.name !== 'nav_mesh_walkable') {
    return false
  }

  pointOnMesh.copy(intersections[0].point)

  return intersections[0].distance >= TOLERANCE
}

function makeDoorWalkable (which: string) {
  const door = navMeshes.find(mesh => mesh.name === which)

  if (door instanceof Mesh) {
    door.material = materialWalkable
  }
}

async function setup () {
  const gltf = await CompressedGLTFLoader.loadAsync(roomsNavMeshUrl)

  navMeshes = gltf.scene.children
  materialWalkable = gltf.scene.getObjectByName('rooms').material

  for (const mesh of navMeshes) {
    mesh.geometry.computeBoundsTree()
  }
}

export function usePathfinding () {

  return {
    setup,
    allowStep,
    makeDoorWalkable
  }
}
