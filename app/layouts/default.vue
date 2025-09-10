<template>
  <div class="geek-layout">
    <!-- Glassmorphic Navigation -->
    <nav class="nav-glass">
      <div class="nav-content">
        <div class="logo" @click="handleLogoClick">
          <span class="text-neon-green font-mono text-xl font-bold">&gt;</span>
        </div>
        <div class="theme-switcher" @click="toggleTheme">
          <div class="yin-yang">
            <div class="yin-yang-inner"></div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Layout Grid -->
    <div class="main-grid" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Terminal Sidebar -->
      <aside class="terminal-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <button @click="toggleSidebar" class="collapse-btn">
            <span class="text-neon-green">{{ sidebarCollapsed ? '>' : '<' }}</span>
          </button>
          <span v-if="!sidebarCollapsed" class="sidebar-title">EXPLORER</span>
        </div>
        
        <div v-if="!sidebarCollapsed" class="directory-tree">
          <div class="tree-item" 
               v-for="(section, index) in sections" 
               :key="section.id"
               :class="{ active: currentSection === section.id }"
               @click="scrollToSection(section.id)">
            <span class="tree-icon">&gt;</span>
            <span class="tree-label">{{ section.name }}</span>
          </div>
        </div>
        
        <!-- Code Lines Indicator -->
        <div class="code-lines" v-if="!sidebarCollapsed">
          <div class="line-indicator" 
               v-for="n in 20" 
               :key="n"
               :style="{ opacity: Math.random() * 0.5 + 0.3 }"></div>
        </div>
        
        <!-- Collapsed State Indicator -->
        <div v-if="sidebarCollapsed" class="collapsed-indicator">
          <div class="pulse-dot"></div>
          <div class="expand-hint">···</div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <slot />
      </main>

      <!-- Status Rail -->
      <aside class="status-rail">
        <div class="status-item">
          <div class="time-display text-mono text-xs">{{ currentTime }}</div>
        </div>
        
        <div class="commit-bubbles">
          <div v-for="commit in recentCommits" 
               :key="commit.id" 
               class="commit-bubble"
               :title="commit.message">
            <div class="commit-dot"></div>
          </div>
        </div>
        
        <div class="cpu-monitor">
          <div class="cpu-label text-mono text-xs">CPU</div>
          <div class="cpu-bar">
            <div class="cpu-usage" :style="{ height: cpuUsage + '%' }"></div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Bottom Info Bar -->
    <footer class="bottom-bar">
      <div class="progress-info">
        <span class="text-mono text-xs">{{ scrollProgress }}%</span>
      </div>
      <div class="route-info">
        <span class="text-mono text-xs">~/pages{{ $route.path === '/' ? '/index' : $route.path }}.vue</span>
      </div>
    </footer>

    <!-- Command Palette -->
    <div v-if="showCommandPalette" class="command-palette">
      <input 
        ref="commandInput"
        v-model="commandQuery"
        @keydown="handleCommandKeydown"
        placeholder="Type a command..."
        class="command-input" />
      <div class="command-suggestions">
        <div v-for="suggestion in filteredCommands" 
             :key="suggestion.command"
             class="command-suggestion"
             @click="executeCommand(suggestion.command)">
          <span class="command-text">&gt;{{ suggestion.command }}</span>
          <span class="command-desc">{{ suggestion.description }}</span>
        </div>
      </div>
    </div>

    <!-- Matrix Rain Canvas -->
    <canvas v-if="showMatrix" ref="matrixCanvas" class="matrix-rain"></canvas>
    
    <!-- Overlay for command palette -->
    <div v-if="showCommandPalette" class="overlay" @click="closeCommandPalette"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMagicKeys, useScroll, useDark } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const isDark = useDark()

// Reactive state
const sidebarCollapsed = ref(false)
const currentSection = ref('hero')
const currentTime = ref('')
const scrollProgress = ref(0)
const cpuUsage = ref(45)
const logoClickCount = ref(0)
const showMatrix = ref(false)
const showCommandPalette = ref(false)
const commandQuery = ref('')
const commandInput = ref(null)

// Sections for navigation
const sections = ref([
  { id: 'hero', name: 'whoami' },
  { id: 'about', name: 'about.md' },
  { id: 'projects', name: 'projects/' },
  { id: 'stack', name: 'stack.json' },
  { id: 'blog', name: 'blog/' },
  { id: 'contact', name: 'contact.sh' }
])

// Mock commit data
const recentCommits = ref([
  { id: 1, message: 'feat: add hero section' },
  { id: 2, message: 'fix: responsive layout' },
  { id: 3, message: 'style: update colors' },
  { id: 4, message: 'docs: update readme' }
])

// Command palette commands
const commands = ref([
  { command: 'projects', description: 'Jump to projects section' },
  { command: 'theme', description: 'Toggle dark/light theme' },
  { command: 'source', description: 'Open GitHub repository' },
  { command: 'matrix', description: 'Toggle matrix rain effect' }
])

const filteredCommands = computed(() => {
  if (!commandQuery.value) return commands.value
  return commands.value.filter(cmd => 
    cmd.command.toLowerCase().includes(commandQuery.value.toLowerCase())
  )
})

// Magic keys setup
const keys = useMagicKeys()
const cmdK = keys['Meta+K']
const escape = keys['Escape']

// Watch for keyboard shortcuts
watch(cmdK, (v) => {
  if (v) {
    showCommandPalette.value = true
    nextTick(() => {
      commandInput.value?.focus()
    })
  }
})

watch(escape, (v) => {
  if (v) {
    if (showMatrix.value) {
      showMatrix.value = false
    } else if (showCommandPalette.value) {
      closeCommandPalette()
    }
  }
})

// Scroll tracking
const { y } = useScroll(window)
watch(y, (newY) => {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  scrollProgress.value = Math.round((newY / (documentHeight - windowHeight)) * 100)
})

// Methods
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleLogoClick = () => {
  logoClickCount.value++
  if (logoClickCount.value >= 5) {
    showMatrix.value = true
    logoClickCount.value = 0
    initMatrixRain()
  }
  
  // Reset counter after 2 seconds
  setTimeout(() => {
    logoClickCount.value = 0
  }, 2000)
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    currentSection.value = sectionId
  }
}

const closeCommandPalette = () => {
  showCommandPalette.value = false
  commandQuery.value = ''
}

const handleCommandKeydown = (e) => {
  if (e.key === 'Enter' && filteredCommands.value.length > 0) {
    executeCommand(filteredCommands.value[0].command)
  }
}

const executeCommand = (command) => {
  switch (command) {
    case 'projects':
      scrollToSection('projects')
      break
    case 'theme':
      toggleTheme()
      break
    case 'source':
      window.open('https://github.com', '_blank')
      break
    case 'matrix':
      showMatrix.value = !showMatrix.value
      if (showMatrix.value) initMatrixRain()
      break
  }
  closeCommandPalette()
}

// Matrix rain effect
const initMatrixRain = () => {
  nextTick(() => {
    const canvas = document.querySelector('.matrix-rain')
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const charArray = chars.split('')
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = []
    
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }
    
    const draw = () => {
      if (!showMatrix.value) return
      
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff9d'
      ctx.font = fontSize + 'px JetBrains Mono'
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      
      requestAnimationFrame(draw)
    }
    
    draw()
  })
}

// Update time
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Simulate CPU usage
const updateCPU = () => {
  cpuUsage.value = Math.floor(Math.random() * 40) + 30
}

// Lifecycle
onMounted(() => {
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)
  const cpuInterval = setInterval(updateCPU, 2000)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(cpuInterval)
  })
})
</script>

<style scoped>
.geek-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
}

/* Navigation */
.nav-glass {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  z-index: 100;
  background: rgba(13, 17, 23, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(230, 237, 243, 0.1);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.yin-yang {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(to right, #fff 50%, #000 50%);
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.yin-yang:hover {
  transform: rotate(180deg);
}

.yin-yang-inner {
  position: absolute;
  top: 25%;
  left: 50%;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: #000;
  transform: translateX(-50%);
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: auto 1fr 80px;
  min-height: calc(100vh - 72px);
  margin-top: 48px;
  transition: grid-template-columns 0.3s ease;
}

.main-grid.sidebar-collapsed {
  grid-template-columns: 48px 1fr 80px;
}

/* Terminal Sidebar */
.terminal-sidebar {
  background: rgba(13, 17, 23, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(230, 237, 243, 0.1);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  min-width: 200px;
  max-width: 400px;
  width: auto;
  box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
}

.terminal-sidebar.collapsed {
  width: 64px;
  min-width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 16px 16px 56px;
  border-bottom: 1px solid rgba(230, 237, 243, 0.1);
  background: rgba(0, 255, 157, 0.05);
  backdrop-filter: blur(5px);
  position: relative;
  height: 64px;
  min-height: 64px;
}

.terminal-sidebar.collapsed .sidebar-header {
  padding: 16px 16px 16px 56px;
  justify-content: center;
  height: 64px;
  min-height: 64px;
}

.collapse-btn {
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 6px;
  color: var(--color-neon-green);
  cursor: pointer;
  padding: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  margin-right: 12px;
}

.collapse-btn {
  background: rgba(0, 255, 157, 0.1);
  border: 1px solid rgba(0, 255, 157, 0.3);
  border-radius: 6px;
  color: var(--color-neon-green);
  cursor: pointer;
  padding: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.terminal-sidebar.collapsed .collapse-btn {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.collapse-btn:hover {
  background: rgba(0, 255, 157, 0.2);
  border-color: rgba(0, 255, 157, 0.5);
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
}

.sidebar-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(230, 237, 243, 0.8);
  text-transform: uppercase;
  background: linear-gradient(45deg, var(--color-neon-green), rgba(0, 255, 157, 0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.directory-tree {
  padding: 16px;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background: rgba(0, 0, 0, 0.2);
}

.tree-item:hover {
  background: rgba(0, 255, 157, 0.1);
  border-color: rgba(0, 255, 157, 0.3);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 255, 157, 0.2);
}

.tree-item.active {
  background: rgba(0, 255, 157, 0.2);
  border-color: rgba(0, 255, 157, 0.5);
  color: var(--color-neon-green);
  box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
}

.tree-icon {
  margin-right: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: bold;
  color: var(--color-neon-green);
  transition: transform 0.2s ease;
}

.tree-item:hover .tree-icon {
  transform: rotate(90deg);
}

.tree-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.code-lines {
  position: absolute;
  right: 8px;
  top: 80px;
  width: 3px;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  overflow: hidden;
}

.line-indicator {
  flex: 1;
  background: linear-gradient(45deg, var(--color-neon-green), rgba(0, 255, 157, 0.6));
  margin: 0.5px 0;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.line-indicator:hover {
  background: var(--color-neon-green);
  box-shadow: 0 0 8px rgba(0, 255, 157, 0.8);
  transform: scaleX(1.5);
}

/* Collapsed State Indicator */
.collapsed-indicator {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neon-green);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.expand-hint {
  writing-mode: vertical-rl;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: rgba(0, 255, 157, 0.6);
  letter-spacing: 2px;
  animation: fadeInOut 3s infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* Main Content */
.main-content {
  padding: 20px;
  overflow-y: auto;
}

/* Status Rail */
.status-rail {
  background: rgba(13, 17, 23, 0.9);
  border-left: 1px solid rgba(230, 237, 243, 0.1);
  padding: 20px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 80px;
  min-width: 80px;
  max-width: 80px;
}

.time-display {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  color: var(--color-text-secondary);
}

.commit-bubbles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.commit-bubble {
  cursor: pointer;
}

.commit-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neon-green);
  transition: transform 0.2s ease;
}

.commit-bubble:hover .commit-dot {
  transform: scale(1.5);
}

.cpu-monitor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.cpu-label {
  writing-mode: vertical-rl;
  color: var(--color-text-secondary);
}

.cpu-bar {
  width: 4px;
  height: 60px;
  background: rgba(139, 148, 158, 0.2);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.cpu-usage {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, var(--color-neon-green), var(--color-purple-electric));
  transition: height 0.5s ease;
}

/* Bottom Bar */
.bottom-bar {
  height: 24px;
  background: rgba(13, 17, 23, 0.9);
  border-top: 1px solid rgba(230, 237, 243, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.progress-info,
.route-info {
  color: var(--color-text-secondary);
}

/* Command Palette */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.command-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-neon-green);
}

.command-suggestions {
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.command-suggestion {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.command-suggestion:hover {
  background: rgba(0, 255, 157, 0.1);
}

.command-text {
  font-family: 'JetBrains Mono', monospace;
  color: var(--color-neon-green);
}

.command-desc {
  color: var(--color-text-secondary);
  font-size: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .terminal-sidebar,
  .status-rail {
    display: none;
  }
}
</style>