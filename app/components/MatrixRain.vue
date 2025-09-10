<template>
  <div v-if="isActive" class="matrix-overlay" @keydown.esc="deactivate">
    <canvas ref="canvas" class="matrix-canvas"></canvas>
    <div class="matrix-exit-hint">
      Press ESC to exit
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deactivate'])

const canvas = ref(null)
const isActive = ref(false)
let ctx
let animationId
let drops = []

watch(() => props.active, (newVal) => {
  if (newVal) {
    activate()
  } else {
    deactivate()
  }
})

function activate() {
  isActive.value = true
  nextTick(() => {
    initMatrix()
    startAnimation()
  })
}

function deactivate() {
  isActive.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  emit('deactivate')
}

function initMatrix() {
  const canvasEl = canvas.value
  ctx = canvasEl.getContext('2d')
  
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight
  
  const columns = Math.floor(canvasEl.width / 20)
  drops.length = 0
  
  for (let i = 0; i < columns; i++) {
    drops[i] = 1
  }
}

function startAnimation() {
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    
    ctx.fillStyle = '#00ff9d'
    ctx.font = '15px JetBrains Mono'
    
    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(Math.random() * 128)
      ctx.fillText(text, i * 20, drops[i] * 20)
      
      if (drops[i] * 20 > canvas.value.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
    
    animationId = requestAnimationFrame(draw)
  }
  
  draw()
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isActive.value) {
      deactivate()
    }
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.matrix-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: black;
}

.matrix-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.matrix-exit-hint {
  position: absolute;
  top: 20px;
  right: 20px;
  color: var(--color-neon-green);
  font-family: var(--font-mono);
  font-size: 14px;
  opacity: 0.7;
}
</style>