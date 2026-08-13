import * as THREE from 'three'

type SunOptions = {
  position?: THREE.Vector3Tuple
}

export function createSun(options: SunOptions = {}) {
  const sunPosition = options.position ?? [6.2, 7.8, 4.8]

  const sunGroup = new THREE.Group()
  sunGroup.name = 'Sun'
  sunGroup.position.set(...sunPosition)

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd36b,
    emissive: 0xffb23f,
    emissiveIntensity: 1.6,
    roughness: 1,
    metalness: 0,
  })

  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 24), coreMaterial)
  sun.name = 'SunCore'
  sun.castShadow = false
  sun.receiveShadow = false
  sunGroup.add(sun)

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xffe4a8,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    }),
  )
  halo.name = 'SunHalo'
  halo.scale.setScalar(1.25)
  halo.castShadow = false
  halo.receiveShadow = false
  sunGroup.add(halo)

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
