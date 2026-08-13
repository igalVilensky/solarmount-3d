import * as THREE from 'three'

type SunOptions = {
  position?: THREE.Vector3Tuple
}

export function createSun(options: SunOptions = {}) {
  const sunPosition = options.position ?? [7.5, 8.5, 6]

  const sunGroup = new THREE.Group()
  sunGroup.name = 'Sun'
  sunGroup.position.set(...sunPosition)

  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd58a,
  })

  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), sunMaterial)
  sun.name = 'SunSphere'
  sun.castShadow = false
  sun.receiveShadow = false
  sunGroup.add(sun)

  const light = new THREE.DirectionalLight(0xfff0d4, 2.8)
  light.name = 'SunLight'
  light.position.set(...sunPosition)
  light.castShadow = true
  light.shadow.mapSize.set(1024, 1024)
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 40
  light.shadow.camera.left = -10
  light.shadow.camera.right = 10
  light.shadow.camera.top = 10
  light.shadow.camera.bottom = -10

  return { sunGroup, light }
}
