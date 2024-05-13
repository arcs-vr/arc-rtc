import { Color, FrontSide, Mesh, MeshBasicMaterial, PlaneGeometry, RingGeometry } from 'three'

const startColor = new Color(0, 1, 1)
const interactionColor = new Color(0, 0, 1)

const geometry = new RingGeometry(0.005, 0.0075, 32)
const material = new MeshBasicMaterial({
  color: startColor.clone(),
  side: FrontSide,
  transparent: true,
  opacity: 0.75,
  depthTest: false,
  depthWrite: false
})

const cursor = new Mesh(geometry, material, { renderOrder: 999 })

const spriteGeometry = new PlaneGeometry(0.055, 0.055, 1)
const spriteMaterial = new MeshBasicMaterial({
  transparent: true,
  color: startColor.clone(),
  opacity: 0,
  depthTest: false,
  depthWrite: false
})

const iconMeshes = {
  primary: new Mesh(spriteGeometry, spriteMaterial, { renderOrder: 999 }),
  secondary: new Mesh(spriteGeometry, spriteMaterial.clone(), { renderOrder: 999 })
}

cursor.position.set(0, 0, -0.35)
iconMeshes.primary.position.set(-0.055, -0.0275, -0.35)
iconMeshes.primary.visible = false
iconMeshes.secondary.position.set(0.055, -0.0275, -0.35)
iconMeshes.primary.visible = false

export function useCursor () {

  return {
    cursor,
    iconMeshes
  }
}
