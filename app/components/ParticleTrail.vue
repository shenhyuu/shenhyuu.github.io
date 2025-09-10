<template>
  <div 
    ref="container" 
    class="particle-container"
    @mousemove="handleMouseMove"
  >
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        opacity: particle.opacity
      }"
    ></div>
  </div>
</template>

<script setup>
const container = ref(null)
const particles = ref([])
let particleId = 0
let lastEmitTime = 0

function handleMouseMove(event) {
  const now = Date.now()
  if (now - lastEmitTime < 150) return // Throttle to 150ms
  
  lastEmitTime = now
  const rect = container.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  createParticle(x, y)
}

function createParticle(x, y) {
  const particle = {
    id: particleId++,
    x: x - 1, // Center the 2px particle
    y: y - 1,
    opacity: 1
  }
  
  particles.value.push(particle)
  
  // Fade out and remove after 800ms
  setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
  }, 800)
  
  // Start fading immediately
  const fadeInterval = setInterval(() => {
    particle.opacity -= 0.05
    if (particle.opacity <= 0) {
      clearInterval(fadeInterval)
    }
  }, 40)
}
</script>

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-neon-green);
  border-radius: 50%;
  box-shadow: 0 0 4px var(--color-neon-green);
  pointer-events: none;
  transition: opacity 0.1s ease-out;
}
</style>