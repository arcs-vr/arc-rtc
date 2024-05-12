import {Pathfinding} from 'three-pathfinding'
import {useCompressedGLTFLoader} from './useCompressedGLTFLoader.ts'

export async function usePathfinding(url: string) {
    const gltfLoader = useCompressedGLTFLoader()
    const navMesh = await gltfLoader.loadAsync(url)
    const pathfinding = new Pathfinding()

    const geometry = navMesh.scene.getObjectByName('nav_mesh')?.geometry
    if (!geometry) {
        throw new Error('Nav Mesh Geometry not found')
    }

    pathfinding.setZoneData('level1', Pathfinding.createZone(geometry))

    return pathfinding
}
