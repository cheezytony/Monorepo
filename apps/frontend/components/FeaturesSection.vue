<template>
  <section class="features">
    <h2 class="features-title">Features</h2>
    <div class="features-grid">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature-card"
      >
        <h3 class="feature-title">
          {{ feature.title }}
        </h3>
        <p class="feature-description">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: 'NestJS Backend',
    description:
      'Powerful backend powered by NestJS with TypeScript and PostgreSQL.',
  },
  {
    title: 'Nuxt Frontend',
    description: 'Modern frontend built with Nuxt 3 and Vue 3 composition API.',
  },
  {
    title: 'Monorepo Architecture',
    description:
      'Efficient multi-package architecture managed with pnpm workspaces.',
  },
];
</script>

<style scoped>
.features {
  padding: 4rem 2rem;
}

.features-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a2e;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.feature-description {
  color: #666;
  line-height: 1.6;
}
</style>
