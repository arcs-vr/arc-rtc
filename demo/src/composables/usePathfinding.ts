import { useCompressedGLTFLoader } from './useCompressedGLTFLoader.ts'
import { Mesh, Raycaster, Vector3 } from 'three'

export type Pathfinding = Awaited<ReturnType<typeof usePathfinding>>

export async function usePathfinding (url: string) {
  const gltfLoader = useCompressedGLTFLoader()

  const navMesh = await gltfLoader.loadAsync(url)
  const materialWalkable = navMesh.scene.getObjectByName('rooms').material

  const raycaster = new Raycaster(undefined, undefined, 0, 24)
  const down = new Vector3(0, -1, 0)
  const minDistanceToFloor = 0.1

  const intersections = []

  raycaster.firstHitOnly = true
  navMesh.scene.traverse(child => {
    if (child instanceof Mesh) {
      child.geometry.computeBoundsTree()
    }
  })

  /**
   * Target is next player body position at feet
   * @param target
   */
  function allowStep (target: Vector3) {
    raycaster.set(target, down)
    intersections.length = 0

    raycaster.intersectObjects(navMesh.scene.children, false, intersections)
    if (intersections.length === 0) {
      return false
    }
    
    if (intersections[0].object.material.name !== 'nav_mesh_walkable') {
      return false
    }

    return intersections[0].distance >= minDistanceToFloor
  }

  function makeDoorWalkable (which: string) {
    const door = navMesh.scene.getObjectByName(which)

    if (door instanceof Mesh) {
      door.material = materialWalkable
    }
  }

  return {
    navMesh,
    allowStep,
    makeDoorWalkable
  }
}
