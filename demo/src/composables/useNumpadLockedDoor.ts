import { RepeatWrapping, Scene } from 'three'

import numpadGltfUrl from '../assets/models/numbers/numpad.gltf?url'
import { usePathfinding } from '../stores/usePathfinding.ts'
import { Vector3Params } from '../types.ts'
import { useRaycastPointer } from '../stores/useRaycastPointer.ts'
import { CompressedGLTFLoader } from '../tools/CompressedGTLFLoader.ts'
import { shallowRef, watchEffect } from 'vue'
import { Easing, Tween } from '@tweenjs/tween.js'

let gltf: Scene | undefined

export async function useNumpadLockedDoor (position: Vector3Params, unlockCode: string, section: string) {
  const { makeDoorWalkable } = await usePathfinding()
  const { addObject } = await useRaycastPointer()

  if (!gltf) {
    gltf = await CompressedGLTFLoader.loadAsync(numpadGltfUrl)
  }

  const newDoor = gltf.scene.clone(true)
  const currentCode = shallowRef<string>('')

  newDoor.position.set(...position)

  const digits = []
  for (let i = 0; i < 6; i++) {
    const digit = newDoor.getObjectByName(`numpad_display_${i}`)
    digits.push(digit)

    digit.material = digit.material.clone()
    digit.material.map = digit.material.map.clone()
    digit.material.map.wrapS = RepeatWrapping
    digit.material.map.wrapT = RepeatWrapping

    digit.material.needsUpdate = true
    digit.material.map.needsUpdate = true
  }

  digits.reverse()

  watchEffect(() => {
    for (let i = 0; i < currentCode.value.length; i++) {
      const number = Number(currentCode.value[i])
      const x = number % 4
      const y = 3 - Math.floor(number / 4)
      digits[i].material.map.offset.set(x * 0.25, y * 0.25) // map is divided in quarters
    }

    for (let i = currentCode.value.length; i < 6; i++) {
      digits[i].material.map.offset.set(0, 0)
    }
  })

  for (let i = 0; i < 10; i++) {
    addObject(newDoor.getObjectByName(`numpad_button_${i}`), {
      maxDistance: 2,
      iconPrimary: 'touch',
      onPrimary () {
        if (currentCode.value.length === 6) {
          return
        }

        currentCode.value += i
      }
    })
  }

  addObject(newDoor.getObjectByName('numpad_button_enter'), {
    maxDistance: 2,
    iconPrimary: 'touch',
    onPrimary () {
      if (currentCode.value === unlockCode) {
        makeDoorWalkable(section)
        const bigDoor = newDoor.getObjectByName('numpad_door_big')
        const smallDoor = newDoor.getObjectByName('numpad_door_small')

        new Tween(bigDoor.position)
          .easing(Easing.Linear.InOut)
          .to({ z: bigDoor.position.z - 9.4 }, 3_000)
          .start()

        new Tween(smallDoor.position)
          .easing(Easing.Linear.InOut)
          .delay(1_500)
          .to({ z: smallDoor.position.z - 4.7 }, 1_500)
          .start()
      }
    }
  })

  addObject(newDoor.getObjectByName('numpad_button_clear'), {
    maxDistance: 2,
    iconPrimary: 'touch',
    onPrimary () {
      currentCode.value = ''
    }
  })

  return newDoor
}
