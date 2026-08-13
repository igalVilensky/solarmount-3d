<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createSolarPanel } from '~/lib/three/createSolarPanel'
import { createSun } from '~/lib/three/createSun'

const viewportRef = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let resizeObserver: ResizeObserver | null = null
let animationFrameId = 0
let onWindowResize: (() => void) | null = null

function updateRendererSize() {
  if (!renderer || !camera || !viewportRef.value) {
    return
  }

  const { clientWidth, clientHeight } = viewportRef.value

  if (clientWidth === 0 || clientHeight === 0) {
    return
  }

  camera.aspect = clientWidth / clientHeight
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(clientWidth, clientHeight, false)
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose())
    return
  }

  material.dispose()
}

function disposeScene(root: THREE.Scene) {
  root.traverse((object) => {
    if ('geometry' in object && object.geometry) {
      object.geometry.dispose()
    }

    if ('material' in object && object.material) {
      disposeMaterial(object.material)
    }
  })
}

function animate() {
  controls?.update()
  renderer?.render(scene as THREE.Scene, camera as THREE.Camera)
  animationFrameId = window.requestAnimationFrame(animate)
}

onMounted(() => {
  if (!viewportRef.value) {
    return
  }

  scene = new THREE.Scene()
  scene.background = null

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(6, 5, 8)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const container = viewportRef.value
  container.appendChild(renderer.domElement)

  const ambientLight = new THREE.HemisphereLight(0xcfe7ff, 0x1a202c, 1.25)
  scene.add(ambientLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.55)
  fillLight.position.set(-4, 6, -2)
  scene.add(fillLight)

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(18, 0.18, 12),
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.95,
      metalness: 0.05,
    }),
  )
  roof.position.y = -0.14
  roof.receiveShadow = true
  scene.add(roof)

  const roofInset = new THREE.Mesh(
    new THREE.PlaneGeometry(16.8, 10.8),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  )
  roofInset.rotation.x = -Math.PI / 2
  roofInset.position.y = -0.049
  roofInset.receiveShadow = true
  scene.add(roofInset)

  const grid = new THREE.GridHelper(16, 16, 0x49617a, 0x2a3949)
  grid.position.y = -0.03
  const gridMaterial = grid.material as THREE.Material | THREE.Material[]
  if (Array.isArray(gridMaterial)) {
    gridMaterial.forEach((material) => {
      material.transparent = true
      material.opacity = 0.16
    })
  } else {
    gridMaterial.transparent = true
    gridMaterial.opacity = 0.16
  }
  scene.add(grid)

  const solarPanel = createSolarPanel()
  solarPanel.position.set(0, 0.1, 0.2)
  solarPanel.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true
      object.receiveShadow = true
    }
  })
  scene.add(solarPanel)

  const { sunGroup, light } = createSun()
  scene.add(sunGroup)
  light.target.position.set(0, 0.15, 0.15)
  scene.add(light.target)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.minDistance = 4.5
  controls.maxDistance = 16
  controls.minPolarAngle = THREE.MathUtils.degToRad(26)
  controls.maxPolarAngle = THREE.MathUtils.degToRad(78)
  controls.target.set(0, 0.25, 0.15)
  controls.update()

  updateRendererSize()

  onWindowResize = () => updateRendererSize()
  window.addEventListener('resize', onWindowResize)

  resizeObserver = new ResizeObserver(() => updateRendererSize())
  resizeObserver.observe(container)

  animate()
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameId)
  if (onWindowResize) {
    window.removeEventListener('resize', onWindowResize)
  }
  resizeObserver?.disconnect()
  controls?.dispose()

  if (scene) {
    disposeScene(scene)
  }

  renderer?.dispose()

  if (renderer?.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }

  controls = null
  resizeObserver = null
  onWindowResize = null
  renderer = null
  scene = null
  camera = null
})
</script>

<template>
  <div
    ref="viewportRef"
    class="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_36%),linear-gradient(180deg,_rgba(2,6,23,0.92),_rgba(15,23,42,0.84))] shadow-2xl shadow-black/40 sm:h-[560px] lg:h-[640px]"
  >
    <div class="pointer-events-none absolute left-5 top-5 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs tracking-[0.28em] text-slate-200/80 backdrop-blur">
      THREE.JS VIEWPORT
    </div>
  </div>
</template>
