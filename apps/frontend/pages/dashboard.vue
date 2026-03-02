<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Dashboard</h1>
      <NuxtLink to="/content/create" class="btn btn-primary">
        + New Content
      </NuxtLink>
    </div>

    <div v-if="loading" class="state-message">Loading…</div>
    <div v-else-if="error" class="state-message state-error">
      {{ error }}
    </div>
    <div v-else-if="items.length === 0" class="state-message">
      No content yet.
      <NuxtLink to="/content/create"> Create your first post. </NuxtLink>
    </div>
    <div v-else class="content-grid">
      <div v-for="item in items" :key="item.id" class="content-card">
        <div class="content-card-header">
          <h2 class="content-card-title">
            {{ item.title }}
          </h2>
          <span class="status-badge" :class="`status-${item.status}`">
            {{ item.status }}
          </span>
        </div>
        <p class="content-card-body">
          {{ item.body }}
        </p>
        <div class="content-card-footer">
          <NuxtLink
            :to="`/content/${item.id}/publish`"
            class="btn btn-sm btn-primary"
          >
            Publish
          </NuxtLink>
          <button class="btn btn-sm btn-danger" @click="remove(item.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from '@monorepo/shared';

definePageMeta({ layout: 'default' });

const { fetchContent, deleteContent } = useContent();

const items = ref<ContentItem[]>([]);
const loading = ref(true);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await fetchContent();
  } catch {
    error.value = 'Failed to load content.';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  if (!confirm('Delete this content item?')) return;
  try {
    await deleteContent(id);
    items.value = items.value.filter((i) => i.id !== id);
  } catch {
    alert('Failed to delete content.');
  }
}

await load();
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a2e;
}

.state-message {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.state-error {
  color: #dc2626;
}

.content-grid {
  display: grid;
  gap: 1rem;
}

.content-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.content-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.content-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  text-transform: capitalize;
}

.status-draft {
  background: #f3f4f6;
  color: #6b7280;
}

.status-published {
  background: #d1fae5;
  color: #065f46;
}

.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.content-card-body {
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-card-footer {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn-sm {
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #1a1a2e;
  color: white;
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  opacity: 0.85;
}
</style>
