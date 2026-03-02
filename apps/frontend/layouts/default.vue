<template>
  <div class="layout-default">
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="nav-brand"> Monorepo App </NuxtLink>
        <div class="nav-links">
          <template v-if="isAuthenticated">
            <span class="nav-user">{{ user?.name }}</span>
            <button class="nav-btn" @click="logout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="nav-link">Sign In</NuxtLink>
            <NuxtLink to="/auth/register" class="nav-link nav-link-primary">
              Register
            </NuxtLink>
          </template>
        </div>
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

<script setup lang="ts">
const { isAuthenticated, user, logout } = useAuth();
</script>

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
  flex: 1;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-link:hover {
  color: white;
}

.nav-link-primary {
  background-color: white;
  color: #1a1a2e;
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  font-weight: 600;
}

.nav-link-primary:hover {
  opacity: 0.9;
  color: #1a1a2e;
}

.nav-user {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
}

.nav-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
