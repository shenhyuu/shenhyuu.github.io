<template>
  <div ref="container" class="three-container"></div>
</template>

<script setup>
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, sphere
let animationId

onMounted(() => {
  initThree()
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

function initThree() {
  // Scene
  scene = new THREE.Scene()
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.z = 5
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(300, 300)
  renderer.setClearColor(0x000000, 0)
  container.value.appendChild(renderer.domElement)
  
  // Geometry - Binary sphere
  const geometry = new THREE.SphereGeometry(2, 32, 32)
  
  // Material with wireframe
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff9d,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  })
  
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
  
  // Add some particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 100
  const posArray = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.6
  })
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  
  if (sphere) {
    sphere.rotation.x += 0.005
    sphere.rotation.y += 0.01
  }
  
  renderer.render(scene, camera)
}
</script>

<style scoped>
.three-container {
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.three-container canvas {
  border-radius: 8px;
}
</style>