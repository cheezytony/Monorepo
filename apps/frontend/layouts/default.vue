<template>
  <div class="layout-default">
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="nav-brand"> Monorepo App </NuxtLink>
      </nav>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <p>
        &copy; {{ new Date().getFullYear() }} Monorepo App. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.main {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}
</style>
