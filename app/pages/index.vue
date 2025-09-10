<template>
  <div class="geek-homepage" @mousemove="handleMouseMove">
    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="hero-content">
        <div class="hero-left">
          <h1 class="title-hero">&gt; whoami</h1>
          <div class="hero-text">
            <p class="text-lg mb-4">Full Stack Developer</p>
            <p class="text-secondary mb-6">Crafting digital experiences with code</p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number text-neon-green">5+</span>
                <span class="stat-label">Years Experience</span>
              </div>
              <div class="stat-item">
                <span class="stat-number text-neon-green">50+</span>
                <span class="stat-label">Projects Completed</span>
              </div>
              <div class="stat-item">
                <span class="stat-number text-neon-green">∞</span>
                <span class="stat-label">Lines of Code</span>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <div ref="binaryBall" class="binary-ball-container">
            <canvas ref="binaryCanvas" class="binary-canvas"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="section-header">
        <h2 class="section-title">&gt; about.md</h2>
      </div>
      <div class="timeline">
        <div v-for="(event, index) in timelineEvents" 
             :key="event.id" 
             class="timeline-item slide-in-up"
             :style="{ animationDelay: index * 100 + 'ms' }">
          <div class="commit-dot" @mouseenter="showCommitInfo(event)" @mouseleave="hideCommitInfo">
            <div class="dot-inner"></div>
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ event.title }}</h3>
            <p class="timeline-date text-mono">{{ event.date }}</p>
            <p class="timeline-desc">{{ event.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Commit Info Tooltip -->
      <div v-if="commitTooltip.show" 
           class="commit-tooltip"
           :style="{ left: commitTooltip.x + 'px', top: commitTooltip.y + 'px' }">
        <div class="tooltip-header">
          <span class="commit-sha text-mono">{{ commitTooltip.sha }}</span>
        </div>
        <div class="tooltip-message">{{ commitTooltip.message }}</div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects-section">
      <div class="section-header">
        <h2 class="section-title">&gt; projects/</h2>
      </div>
      <div class="projects-container" ref="projectsContainer">
        <div class="projects-scroll">
          <div v-for="(project, index) in projects" 
               :key="project.id" 
               class="project-card glow-neon card-tilt"
               @mouseenter="handleCardTilt"
               @mousemove="handleCardMouseMove"
               @mouseleave="handleCardMouseLeave">
            <div class="language-bar" :style="{ backgroundColor: project.languageColor }"></div>
            <div class="card-header">
              <h3 class="project-title">{{ project.name }}</h3>
              <div class="project-stars">
                <span class="star-icon">⭐</span>
                <span class="star-count">{{ project.stars }}</span>
              </div>
            </div>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-tech">
              <span v-for="tech in project.technologies" 
                    :key="tech" 
                    class="tech-tag text-mono">{{ tech }}</span>
            </div>
            <div class="project-links">
              <UButton variant="ghost" size="sm" class="project-link">
                <span class="text-mono">&gt; demo</span>
              </UButton>
              <UButton variant="ghost" size="sm" class="project-link">
                <span class="text-mono">&gt; code</span>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stack Section -->
    <section id="stack" class="stack-section">
      <div class="section-header">
        <h2 class="section-title">&gt; stack.json</h2>
      </div>
      <div class="stack-grid">
        <div v-for="(tech, index) in techStack" 
             :key="tech.name" 
             class="tech-item slide-in-up"
             :style="{ animationDelay: index * 50 + 'ms' }"
             @mouseenter="flipTech(tech)"
             @mouseleave="unflipTech(tech)">
          <div class="tech-bracket-container">
            <div class="tech-bracket">
              <span class="bracket-left">{</span>
              <div class="tech-content" :class="{ flipped: tech.flipped }">
                <div class="tech-front">
                  <div class="tech-icon" v-html="tech.icon"></div>
                </div>
                <div class="tech-back">
                  <span class="tech-name text-mono">{{ tech.name }}</span>
                </div>
              </div>
              <span class="bracket-right">}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
    <section id="blog" class="blog-section">
      <div class="section-header">
        <h2 class="section-title">&gt; blog/</h2>
      </div>
      <div class="blog-list">
        <article v-for="(post, index) in blogPosts" 
                 :key="post.id" 
                 class="blog-item glow-neon slide-in-up"
                 :style="{ animationDelay: index * 100 + 'ms' }">
          <div class="blog-progress">
            <div class="progress-bar" :style="{ height: post.readProgress + '%' }"></div>
          </div>
          <div class="blog-content">
            <h3 class="blog-title">{{ post.title }}</h3>
            <p class="blog-date text-mono text-sm">{{ post.date }}</p>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <div class="blog-tags">
              <span v-for="tag in post.tags" 
                    :key="tag" 
                    class="blog-tag text-mono">#{{ tag }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="section-header">
        <h2 class="section-title">&gt; contact.sh</h2>
      </div>
      <div class="contact-form">
        <div class="terminal-window">
          <div class="terminal-header">
            <div class="terminal-buttons">
              <span class="terminal-btn close"></span>
              <span class="terminal-btn minimize"></span>
              <span class="terminal-btn maximize"></span>
            </div>
            <span class="terminal-title text-mono">contact@geek.dev</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-line">
              <span class="prompt text-neon-green">$</span>
              <input 
                ref="contactInput"
                v-model="contactMessage"
                class="terminal-input"
                :placeholder="currentPlaceholder"
                @keydown.enter="sendMessage" />
            </div>
            <div v-if="messageSent" class="terminal-response">
              <span class="text-neon-green">&gt; Message sent successfully!</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Particle Trail -->
    <div v-for="particle in particles" 
         :key="particle.id" 
         class="particle"
         :style="{ left: particle.x + 'px', top: particle.y + 'px' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useIntersectionObserver, useInterval } from '@vueuse/core'

// Reactive state
const particles = ref([])
const contactMessage = ref('')
const messageSent = ref(false)
const currentPlaceholder = ref('')
const binaryCanvas = ref(null)
const projectsContainer = ref(null)
const contactInput = ref(null)

// Placeholder animation
const placeholders = [
  '>_ email me at hello@dev.com',
  '>_ telegram @geekdev',
  '>_ twitter @coder',
  '>_ linkedin /in/developer',
  '>_ discord geek#1337'
]
let placeholderIndex = 0
let charIndex = 0
let isDeleting = false

// Timeline events
const timelineEvents = ref([
  {
    id: 1,
    title: 'Started Programming Journey',
    date: '2019-01-15',
    description: 'Began learning web development with HTML, CSS, and JavaScript',
    sha: 'a1b2c3d',
    message: 'feat: initial commit - hello world'
  },
  {
    id: 2,
    title: 'First Full-Stack Project',
    date: '2020-06-20',
    description: 'Built my first complete web application using React and Node.js',
    sha: 'e4f5g6h',
    message: 'feat: add user authentication system'
  },
  {
    id: 3,
    title: 'Joined Tech Company',
    date: '2021-03-10',
    description: 'Started working as a junior developer at a startup',
    sha: 'i7j8k9l',
    message: 'refactor: optimize database queries'
  },
  {
    id: 4,
    title: 'Senior Developer',
    date: '2023-08-15',
    description: 'Promoted to senior developer, leading a team of 5 developers',
    sha: 'm0n1o2p',
    message: 'feat: implement microservices architecture'
  }
])

// Projects data
const projects = ref([
  {
    id: 1,
    name: 'AI Chat Bot',
    description: 'Intelligent chatbot powered by machine learning algorithms',
    technologies: ['Python', 'TensorFlow', 'FastAPI'],
    stars: 234,
    languageColor: '#3776ab'
  },
  {
    id: 2,
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with real-time inventory',
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    stars: 156,
    languageColor: '#4fc08d'
  },
  {
    id: 3,
    name: 'DevOps Dashboard',
    description: 'Monitoring and deployment dashboard for containerized apps',
    technologies: ['React', 'Docker', 'Kubernetes'],
    stars: 89,
    languageColor: '#61dafb'
  },
  {
    id: 4,
    name: 'Blockchain Wallet',
    description: 'Secure cryptocurrency wallet with multi-chain support',
    technologies: ['Rust', 'WebAssembly', 'Ethereum'],
    stars: 312,
    languageColor: '#ce422b'
  }
])

// Tech stack
const techStack = ref([
  { name: 'JavaScript', icon: '🟨', flipped: false },
  { name: 'TypeScript', icon: '🔷', flipped: false },
  { name: 'Vue.js', icon: '💚', flipped: false },
  { name: 'React', icon: '⚛️', flipped: false },
  { name: 'Node.js', icon: '🟢', flipped: false },
  { name: 'Python', icon: '🐍', flipped: false },
  { name: 'Rust', icon: '🦀', flipped: false },
  { name: 'Docker', icon: '🐳', flipped: false },
  { name: 'AWS', icon: '☁️', flipped: false },
  { name: 'PostgreSQL', icon: '🐘', flipped: false },
  { name: 'Redis', icon: '🔴', flipped: false },
  { name: 'GraphQL', icon: '💜', flipped: false }
])

// Blog posts
const blogPosts = ref([
  {
    id: 1,
    title: 'Building Scalable Microservices with Node.js',
    date: '2024-01-15',
    excerpt: 'Learn how to architect and deploy microservices that can handle millions of requests...',
    tags: ['nodejs', 'microservices', 'architecture'],
    readProgress: 75
  },
  {
    id: 2,
    title: 'The Future of Web Development: WebAssembly',
    date: '2024-01-08',
    excerpt: 'Exploring how WebAssembly is revolutionizing web performance and capabilities...',
    tags: ['webassembly', 'performance', 'future'],
    readProgress: 60
  },
  {
    id: 3,
    title: 'Mastering Vue 3 Composition API',
    date: '2024-01-01',
    excerpt: 'Deep dive into Vue 3\'s Composition API and how it improves code organization...',
    tags: ['vue', 'composition-api', 'tutorial'],
    readProgress: 90
  }
])

// Commit tooltip
const commitTooltip = ref({
  show: false,
  x: 0,
  y: 0,
  sha: '',
  message: ''
})

// Methods
let handleMouseMove = (e) => {
  // Only create particles in hero section
  const heroSection = document.getElementById('hero')
  if (!heroSection) return
  
  const rect = heroSection.getBoundingClientRect()
  if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
    createParticle(e.clientX, e.clientY)
  }
}

const createParticle = (x, y) => {
  const particle = {
    id: Date.now() + Math.random(),
    x: x,
    y: y
  }
  
  particles.value.push(particle)
  
  // Remove particle after animation
  setTimeout(() => {
    const index = particles.value.findIndex(p => p.id === particle.id)
    if (index > -1) {
      particles.value.splice(index, 1)
    }
  }, 800)
}

const showCommitInfo = (event) => {
  commitTooltip.value = {
    show: true,
    x: event.clientX || 0,
    y: event.clientY || 0,
    sha: event.sha,
    message: event.message
  }
}

const hideCommitInfo = () => {
  commitTooltip.value.show = false
}

const handleCardTilt = (e) => {
  // 3D tilt effect will be handled by CSS
}

const handleCardMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = (y - centerY) / centerY * -8
  const rotateY = (x - centerX) / centerX * 8
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

const handleCardMouseLeave = (e) => {
  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
}

const flipTech = (tech) => {
  tech.flipped = true
}

const unflipTech = (tech) => {
  tech.flipped = false
}

const sendMessage = () => {
  if (contactMessage.value.trim()) {
    messageSent.value = true
    contactMessage.value = ''
    
    setTimeout(() => {
      messageSent.value = false
    }, 3000)
  }
}

// Placeholder typewriter effect
const typewriterEffect = () => {
  const currentText = placeholders[placeholderIndex]
  
  if (!isDeleting) {
    currentPlaceholder.value = currentText.substring(0, charIndex + 1)
    charIndex++
    
    if (charIndex === currentText.length) {
      isDeleting = true
      setTimeout(typewriterEffect, 2000) // Pause before deleting
      return
    }
  } else {
    currentPlaceholder.value = currentText.substring(0, charIndex - 1)
    charIndex--
    
    if (charIndex === 0) {
      isDeleting = false
      placeholderIndex = (placeholderIndex + 1) % placeholders.length
    }
  }
  
  setTimeout(typewriterEffect, isDeleting ? 50 : 100)
}

// Binary ball 3D effect
const initBinaryBall = () => {
  nextTick(() => {
    const canvas = binaryCanvas.value
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 300
    
    let rotation = 0
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 100
      
      // Draw binary digits in 3D sphere
      for (let i = 0; i < 100; i++) {
        const angle1 = (i * 0.1 + rotation) % (Math.PI * 2)
        const angle2 = (i * 0.05) % Math.PI
        
        const x = centerX + Math.cos(angle1) * Math.sin(angle2) * radius
        const y = centerY + Math.sin(angle1) * Math.sin(angle2) * radius
        const z = Math.cos(angle2) * radius
        
        const scale = (z + radius) / (radius * 2)
        const opacity = scale
        
        ctx.fillStyle = `rgba(0, 255, 157, ${opacity})`
        ctx.font = `${12 * scale}px JetBrains Mono`
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y)
      }
      
      rotation += 0.01
      requestAnimationFrame(draw)
    }
    
    draw()
  })
}

// Lifecycle
onMounted(() => {
  typewriterEffect()
  initBinaryBall()
  
  // Throttle particle creation
  let lastParticleTime = 0
  const originalHandleMouseMove = handleMouseMove
  
  handleMouseMove = (e) => {
    const now = Date.now()
    if (now - lastParticleTime > 150) {
      originalHandleMouseMove(e)
      lastParticleTime = now
    }
  }
})

// SEO
useHead({
  title: 'Geek Developer - Full Stack Engineer',
  meta: [
    { name: 'description', content: 'Full Stack Developer specializing in modern web technologies, microservices, and cloud architecture.' },
    { name: 'keywords', content: 'developer, full stack, vue, react, node.js, python, rust, devops' }
  ]
})
</script>

<style scoped>
.geek-homepage {
  position: relative;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 40px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-stats {
  display: flex;
  gap: 40px;
  margin-top: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.binary-ball-container {
  position: relative;
}

.binary-canvas {
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 157, 0.1), transparent);
}

/* Section Styles */
section {
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 60px;
}

.section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 800;
  color: var(--color-neon-green);
  margin-bottom: 20px;
}

/* About Section */
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-neon-green), var(--color-purple-electric));
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  opacity: 0;
}

.commit-dot {
  position: absolute;
  left: -28px;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-neon-green);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.commit-dot:hover {
  transform: scale(1.5);
}

.dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: var(--color-bg-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.timeline-content {
  background: rgba(13, 17, 23, 0.8);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(230, 237, 243, 0.1);
}

.timeline-title {
  color: var(--color-text-primary);
  font-size: 18px;
  margin-bottom: 8px;
}

.timeline-date {
  color: var(--color-neon-green);
  font-size: 12px;
  margin-bottom: 12px;
}

.timeline-desc {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.commit-tooltip {
  position: fixed;
  background: rgba(13, 17, 23, 0.95);
  border: 1px solid var(--color-neon-green);
  border-radius: 4px;
  padding: 8px 12px;
  z-index: 1000;
  pointer-events: none;
}

.commit-sha {
  color: var(--color-neon-green);
  font-size: 10px;
}

.tooltip-message {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-top: 4px;
}

/* Projects Section */
.projects-container {
  overflow-x: auto;
  padding: 20px 0;
}

.projects-scroll {
  display: flex;
  gap: 30px;
  padding-bottom: 20px;
}

.project-card {
  min-width: 350px;
  background: rgba(13, 17, 23, 0.8);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  cursor: pointer;
}

.language-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 12px 12px 0 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.project-stars {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
}

.star-icon {
  font-size: 14px;
}

.star-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}

.project-desc {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tech-tag {
  background: rgba(0, 255, 157, 0.1);
  color: var(--color-neon-green);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.project-links {
  display: flex;
  gap: 12px;
}

.project-link {
  border: 1px solid var(--color-neon-green);
  color: var(--color-neon-green);
}

/* Stack Section */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.tech-item {
  opacity: 0;
}

.tech-bracket-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.tech-bracket {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: var(--color-neon-green);
}

.tech-content {
  width: 40px;
  height: 40px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.tech-content.flipped {
  transform: rotateY(180deg);
}

.tech-front,
.tech-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}

.tech-back {
  transform: rotateY(180deg);
}

.tech-icon {
  font-size: 24px;
}

.tech-name {
  font-size: 10px;
  text-align: center;
  color: var(--color-text-primary);
}

/* Blog Section */
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.blog-item {
  display: flex;
  background: rgba(13, 17, 23, 0.8);
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
}

.blog-progress {
  width: 4px;
  background: rgba(139, 148, 158, 0.2);
  position: relative;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: var(--color-neon-green);
  transition: height 0.3s ease;
}

.blog-content {
  padding: 24px;
  flex: 1;
}

.blog-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.blog-date {
  color: var(--color-neon-green);
  margin-bottom: 12px;
}

.blog-excerpt {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blog-tag {
  color: var(--color-purple-electric);
  font-size: 12px;
}

/* Contact Section */
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.terminal-window {
  background: rgba(13, 17, 23, 0.95);
  border-radius: 8px;
  border: 1px solid rgba(230, 237, 243, 0.1);
  overflow: hidden;
}

.terminal-header {
  background: rgba(230, 237, 243, 0.05);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.terminal-buttons {
  display: flex;
  gap: 6px;
}

.terminal-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-btn.close {
  background: #ff5f57;
}

.terminal-btn.minimize {
  background: #ffbd2e;
}

.terminal-btn.maximize {
  background: #28ca42;
}

.terminal-title {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.terminal-body {
  padding: 20px;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prompt {
  font-family: 'JetBrains Mono', monospace;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.terminal-response {
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .projects-scroll {
    flex-direction: column;
  }
  
  .project-card {
    min-width: auto;
  }
  
  .stack-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  section {
    padding: 60px 20px;
  }
}
</style>