<template>
  <div class="app-alert">
    <slot />
  </div>
</template>

<style scoped>
.app-alert {
  padding: 12px;
  background-color: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 4px;
  margin: 16px 0;
  color: #1565c0;
}
</style>