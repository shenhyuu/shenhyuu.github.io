<template>
  <div v-if="isOpen" class="command-overlay" @click="close">
    <div class="command-palette" @click.stop>
      <div class="command-header">
        <span class="command-prompt">></span>
        <input 
          ref="input"
          v-model="query"
          class="command-input"
          placeholder="Type a command..."
          @keydown.enter="executeCommand"
          @keydown.esc="close"
        >
      </div>
      
      <div v-if="suggestions.length" class="command-suggestions">
        <div 
          v-for="(suggestion, index) in suggestions" 
          :key="suggestion.command"
          class="command-suggestion"
          :class="{ active: index === selectedIndex }"
          @click="selectSuggestion(suggestion)"
        >
          <span class="suggestion-command">{{ suggestion.command }}</span>
          <span class="suggestion-desc">{{ suggestion.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const input = ref(null)

const commands = [
  { command: 'projects', description: 'Jump to projects section' },
  { command: 'theme', description: 'Toggle light/dark theme' },
  { command: 'source', description: 'Open GitHub repository' },
  { command: 'about', description: 'Jump to about section' },
  { command: 'contact', description: 'Jump to contact section' },
  { command: 'stack', description: 'Jump to tech stack section' },
  { command: 'blog', description: 'Jump to blog section' }
]

const suggestions = computed(() => {
  if (!query.value) return commands
  return commands.filter(cmd => 
    cmd.command.toLowerCase().includes(query.value.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.value.toLowerCase())
  )
})

function open() {
  isOpen.value = true
  nextTick(() => {
    input.value?.focus()
  })
}

function close() {
  isOpen.value = false
  query.value = ''
  selectedIndex.value = 0
}

function executeCommand() {
  const cmd = suggestions.value[selectedIndex.value] || suggestions.value[0]
  if (cmd) {
    selectSuggestion(cmd)
  }
}

function selectSuggestion(suggestion) {
  switch (suggestion.command) {
    case 'projects':
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'theme':
      // Toggle theme logic would go here
      document.documentElement.classList.toggle('dark')
      break
    case 'source':
      window.open('https://github.com', '_blank')
      break
    case 'about':
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'contact':
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'stack':
      document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' })
      break
    case 'blog':
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })
      break
  }
  close()
}

// Listen for Cmd+K / Ctrl+K
onMounted(() => {
  const handleKeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      if (isOpen.value) {
        close()
      } else {
        open()
      }
    }
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})

defineExpose({ open, close })
</script>

<style scoped>
.command-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20vh;
}

.command-palette {
  width: 500px;
  max-width: 90vw;
  background: var(--color-bg-primary);
  border: 1px solid rgba(230, 237, 243, 0.2);
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.command-header {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(230, 237, 243, 0.1);
}

.command-prompt {
  color: var(--color-neon-green);
  font-family: var(--font-mono);
  font-weight: bold;
  margin-right: 8px;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 16px;
}

.command-input::placeholder {
  color: var(--color-text-secondary);
}

.command-suggestions {
  max-height: 300px;
  overflow-y: auto;
}

.command-suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.command-suggestion:hover,
.command-suggestion.active {
  background: rgba(0, 255, 157, 0.1);
}

.suggestion-command {
  color: var(--color-neon-green);
  font-family: var(--font-mono);
  font-weight: 600;
}

.suggestion-desc {
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>