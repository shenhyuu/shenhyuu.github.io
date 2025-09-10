<template>
  <div class="layout">
    <header class="header">
      <h1>📘 我的 Nuxt 应用</h1>
      <nav>
        <NuxtLink to="/">首页</NuxtLink> |
        <NuxtLink to="/about">关于</NuxtLink>
      </nav>
    </header>

    <main class="main">
      <slot /> <!-- 页面内容将在这里渲染 -->
    </main>

    <footer class="footer">
      <p>© 2025 我的公司 - 使用 Nuxt 构建</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #3f51b5;
  color: white;
  padding: 1rem;
  text-align: center;
}

.header nav {
  margin-top: 0.5rem;
}

.header a {
  color: white;
  text-decoration: none;
  margin: 0 8px;
}

.header a:hover {
  text-decoration: underline;
}

.main {
  flex: 1;
  padding: 2rem;
}

.footer {
  background: #f5f5f5;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}
</style>