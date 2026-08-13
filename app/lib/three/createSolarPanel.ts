import * as THREE from 'three'

type SolarPanelOptions = {
  width?: number
  height?: number
  tiltDegrees?: number
}

export function createSolarPanel(options: SolarPanelOptions = {}) {
  const width = options.width ?? 1.72
  const height = options.height ?? 1.13
  const tiltRadians = THREE.MathUtils.degToRad(options.tiltDegrees ?? 30)

  const panelGroup = new THREE.Group()
  panelGroup.name = 'SolarPanel'
  panelGroup.rotation.y = -0.35
  panelGroup.rotation.x = -tiltRadians

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa7b8,
    metalness: 0.7,
    roughness: 0.25,
  })

  const cellMaterial = new THREE.MeshStandardMaterial({
    color: 0x17345e,
    metalness: 0.2,
    roughness: 0.5,
  })

  const panelThickness = 0.045
  const frameThickness = 0.05
  const frameDepth = 0.03

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(width, panelThickness, height),
    frameMaterial,
  )
  frame.castShadow = true
  frame.receiveShadow = true
  panelGroup.add(frame)

  const cells = new THREE.Mesh(
    new THREE.BoxGeometry(width - frameThickness * 2, panelThickness * 0.45, height - frameThickness * 2),
    cellMaterial,
  )
  cells.position.y = panelThickness * 0.12
  cells.castShadow = true
  cells.receiveShadow = true
  panelGroup.add(cells)

  const support = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.18, panelThickness * 1.2, frameDepth),
    frameMaterial,
  )
  support.position.set(0, -0.18, 0.2)
  support.rotation.x = -0.25
  support.castShadow = true
  support.receiveShadow = true
  panelGroup.add(support)

  const rearRail = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.9, frameDepth, frameDepth),
    frameMaterial,
  )
  rearRail.position.set(0, -0.22, -0.34)
  rearRail.castShadow = true
  rearRail.receiveShadow = true
  panelGroup.add(rearRail)

  return panelGroup
}
