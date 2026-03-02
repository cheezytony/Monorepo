<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Welcome to Monorepo App</h1>
      <p class="hero-subtitle">
        A full-stack application built with NestJS and Nuxt.
      </p>
      <div class="hero-actions">
        <NuxtLink to="/about" class="btn btn-primary"> Get Started </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1a1a2e;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.85;
}

.btn-primary {
  background-color: #1a1a2e;
  color: white;
}
</style>
