import * as THREE from 'three'

type SolarPanelOptions = {
  width?: number
  height?: number
  tiltDegrees?: number
}

export type SolarPanelRig = {
  root: THREE.Group
  azimuthGroup: THREE.Group
  tiltPivot: THREE.Group
  panelAssembly: THREE.Group
}

function createBar(width: number, height: number, depth: number, material: THREE.Material) {
  const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
  bar.castShadow = true
  bar.receiveShadow = true
  return bar
}

function createSupportRod(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
) {
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), material)
  rod.position.copy(start).add(end).multiplyScalar(0.5)
  rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  rod.castShadow = true
  rod.receiveShadow = true
  return rod
}

export function createSolarPanel(options: SolarPanelOptions = {}): SolarPanelRig {
  const width = options.width ?? 1.72
  const height = options.height ?? 1.13
  const tiltRadians = THREE.MathUtils.degToRad(options.tiltDegrees ?? 30)

  const root = new THREE.Group()
  root.name = 'SolarPanelRoot'

  const azimuthGroup = new THREE.Group()
  azimuthGroup.name = 'SolarPanelAzimuthGroup'
  azimuthGroup.rotation.y = -0.35
  root.add(azimuthGroup)

  const structureMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa7b8,
    metalness: 0.72,
    roughness: 0.28,
  })

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b96a8,
    metalness: 0.68,
    roughness: 0.32,
  })

  const cellMaterial = new THREE.MeshStandardMaterial({
    color: 0x17345e,
    metalness: 0.18,
    roughness: 0.45,
  })

  const panelThickness = 0.045
  const panelClearance = 0.012
  const frontRailY = 0.1
  const rearRailY = 0.56
  const frontRailZ = 0.0
  const rearRailZ = height * 0.76
  const halfWidth = width * 0.5

  const mountingStructure = new THREE.Group()
  mountingStructure.name = 'MountingStructure'
  azimuthGroup.add(mountingStructure)

  const frontRail = createBar(width * 0.94, 0.04, 0.06, structureMaterial)
  frontRail.position.set(0, frontRailY, frontRailZ)
  mountingStructure.add(frontRail)

  const rearRail = createBar(width * 0.88, 0.04, 0.06, structureMaterial)
  rearRail.position.set(0, rearRailY, rearRailZ)
  mountingStructure.add(rearRail)

  const frontFootOffsetX = halfWidth * 0.8
  const rearFootOffsetX = halfWidth * 0.72

  const frontFootLeft = createBar(0.08, frontRailY, 0.08, frameMaterial)
  frontFootLeft.position.set(-frontFootOffsetX, frontRailY * 0.5, 0.03)
  mountingStructure.add(frontFootLeft)

  const frontFootRight = createBar(0.08, frontRailY, 0.08, frameMaterial)
  frontFootRight.position.set(frontFootOffsetX, frontRailY * 0.5, 0.03)
  mountingStructure.add(frontFootRight)

  const rearSupportLeft = createSupportRod(
    new THREE.Vector3(-rearFootOffsetX, 0.03, 0.18),
    new THREE.Vector3(-rearFootOffsetX, rearRailY, rearRailZ),
    0.022,
    structureMaterial,
  )
  mountingStructure.add(rearSupportLeft)

  const rearSupportRight = createSupportRod(
    new THREE.Vector3(rearFootOffsetX, 0.03, 0.18),
    new THREE.Vector3(rearFootOffsetX, rearRailY, rearRailZ),
    0.022,
    structureMaterial,
  )
  mountingStructure.add(rearSupportRight)

  const crossBrace = createBar(width * 0.3, 0.028, 0.028, structureMaterial)
  crossBrace.position.set(0, (frontRailY + rearRailY) * 0.5, rearRailZ * 0.55)
  crossBrace.rotation.z = Math.PI / 2
  mountingStructure.add(crossBrace)

  const tiltPivot = new THREE.Group()
  tiltPivot.name = 'SolarPanelTiltPivot'
  tiltPivot.position.set(0, frontRailY + 0.015, 0.01)
  tiltPivot.rotation.x = -tiltRadians
  azimuthGroup.add(tiltPivot)

  const panelAssembly = new THREE.Group()
  panelAssembly.name = 'SolarPanelAssembly'
  panelAssembly.position.set(0, panelClearance, 0)
  tiltPivot.add(panelAssembly)

  const panelBody = new THREE.Mesh(
    new THREE.BoxGeometry(width, panelThickness, height),
    frameMaterial,
  )
  panelBody.position.set(0, panelThickness * 0.5, height * 0.5)
  panelBody.castShadow = true
  panelBody.receiveShadow = true
  panelAssembly.add(panelBody)

  const cellField = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.16, panelThickness * 0.34, height - 0.14),
    cellMaterial,
  )
  cellField.position.set(0, panelThickness * 0.66, height * 0.5 + 0.01)
  cellField.castShadow = true
  cellField.receiveShadow = true
  panelAssembly.add(cellField)

  const glazing = new THREE.Mesh(
    new THREE.BoxGeometry(width - 0.03, 0.009, height - 0.03),
    new THREE.MeshStandardMaterial({
      color: 0x1d3f6b,
      metalness: 0.05,
      roughness: 0.18,
      transparent: true,
      opacity: 0.55,
    }),
  )
  glazing.position.set(0, panelThickness + 0.0045, height * 0.5)
  glazing.castShadow = true
  glazing.receiveShadow = true
  panelAssembly.add(glazing)

  const sideFrameLeft = createBar(0.03, panelThickness + 0.012, height - 0.02, structureMaterial)
  sideFrameLeft.position.set(-width * 0.5 + 0.015, panelThickness * 0.5, height * 0.5)
  panelAssembly.add(sideFrameLeft)

  const sideFrameRight = createBar(0.03, panelThickness + 0.012, height - 0.02, structureMaterial)
  sideFrameRight.position.set(width * 0.5 - 0.015, panelThickness * 0.5, height * 0.5)
  panelAssembly.add(sideFrameRight)

  const topFrame = createBar(width - 0.02, panelThickness + 0.012, 0.03, structureMaterial)
  topFrame.position.set(0, panelThickness * 0.5, height - 0.015)
  panelAssembly.add(topFrame)

  const bottomFrame = createBar(width - 0.02, panelThickness + 0.012, 0.03, structureMaterial)
  bottomFrame.position.set(0, panelThickness * 0.5, 0.015)
  panelAssembly.add(bottomFrame)

  const rearKickerLeft = createSupportRod(
    new THREE.Vector3(-halfWidth * 0.6, frontRailY, 0.06),
    new THREE.Vector3(-halfWidth * 0.52, rearRailY, rearRailZ - 0.05),
    0.015,
    structureMaterial,
  )
  mountingStructure.add(rearKickerLeft)

  const rearKickerRight = createSupportRod(
    new THREE.Vector3(halfWidth * 0.6, frontRailY, 0.06),
    new THREE.Vector3(halfWidth * 0.52, rearRailY, rearRailZ - 0.05),
    0.015,
    structureMaterial,
  )
  mountingStructure.add(rearKickerRight)

  return {
    root,
    azimuthGroup,
    tiltPivot,
    panelAssembly,
  }
}
