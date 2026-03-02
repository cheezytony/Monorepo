<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Platform Connections</h1>
      <button class="btn btn-primary" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add Platform' }}
      </button>
    </div>

    <!-- Add connection form -->
    <div v-if="showForm" class="card form-card">
      <h2 class="form-title">Connect a Platform</h2>
      <form @submit.prevent="handleAdd">
        <div class="form-group">
          <label class="form-label">Platform</label>
          <select v-model="form.platform" class="form-input" required>
            <option value="">Select a platform…</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="x">X (Twitter)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Authentication Type</label>
          <select v-model="form.authType" class="form-input" required>
            <option value="">Select auth type…</option>
            <option value="api_key">API Key</option>
            <option value="oauth">OAuth Token</option>
          </select>
        </div>
        <div v-if="form.authType === 'api_key'" class="form-group">
          <label class="form-label">API Key</label>
          <input
            v-model="form.apiKey"
            type="password"
            class="form-input"
            placeholder="Paste your API key"
            required
          />
        </div>
        <div v-if="form.authType === 'oauth'" class="form-group">
          <label class="form-label">OAuth Token</label>
          <input
            v-model="form.oauthToken"
            type="password"
            class="form-input"
            placeholder="Paste your OAuth token"
            required
          />
        </div>
        <div v-if="form.authType === 'oauth'" class="form-group">
          <label class="form-label">OAuth Token Secret (optional)</label>
          <input
            v-model="form.oauthTokenSecret"
            type="password"
            class="form-input"
            placeholder="Paste your token secret if required"
          />
        </div>
        <p v-if="formError" class="form-error">
          {{ formError }}
        </p>
        <button type="submit" class="btn btn-primary" :disabled="adding">
          {{ adding ? 'Connecting…' : 'Connect' }}
        </button>
      </form>
    </div>

    <!-- Connections list -->
    <div v-if="loading" class="state-message">Loading…</div>
    <div v-else-if="error" class="state-message state-error">
      {{ error }}
    </div>
    <div v-else-if="connections.length === 0" class="state-message">
      No platform connections yet. Add one above.
    </div>
    <div v-else class="connections-list">
      <div v-for="conn in connections" :key="conn.id" class="connection-card">
        <div class="connection-info">
          <span class="platform-icon">{{ platformIcon(conn.platform) }}</span>
          <div>
            <p class="platform-name">
              {{ platformLabel(conn.platform) }}
            </p>
            <p class="auth-meta">
              {{ conn.authType === 'api_key' ? 'API Key' : 'OAuth' }} ·
              {{ conn.maskedCredential }}
            </p>
          </div>
        </div>
        <button class="btn btn-sm btn-danger" @click="remove(conn.id)">
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlatformConnection, PlatformType } from '@monorepo/shared';

definePageMeta({ layout: 'default' });

const { fetchConnections, addConnection, removeConnection } = usePlatforms();

const connections = ref<PlatformConnection[]>([]);
const loading = ref(true);
const error = ref('');
const showForm = ref(false);
const adding = ref(false);
const formError = ref('');

const form = reactive({
  platform: '' as PlatformType | '',
  authType: '' as 'api_key' | 'oauth' | '',
  apiKey: '',
  oauthToken: '',
  oauthTokenSecret: '',
});

const PLATFORM_LABELS: Record<PlatformType, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X (Twitter)',
};

const PLATFORM_ICONS: Record<PlatformType, string> = {
  youtube: '▶️',
  instagram: '📷',
  tiktok: '🎵',
  x: '🐦',
};

function platformLabel(p: PlatformType) {
  return PLATFORM_LABELS[p] ?? p;
}

function platformIcon(p: PlatformType) {
  return PLATFORM_ICONS[p] ?? '🔗';
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    connections.value = await fetchConnections();
  } catch {
    error.value = 'Failed to load connections.';
  } finally {
    loading.value = false;
  }
}

async function handleAdd() {
  if (!form.platform || !form.authType) return;
  adding.value = true;
  formError.value = '';
  try {
    const created = await addConnection({
      platform: form.platform as PlatformType,
      authType: form.authType as 'api_key' | 'oauth',
      apiKey: form.apiKey || undefined,
      oauthToken: form.oauthToken || undefined,
      oauthTokenSecret: form.oauthTokenSecret || undefined,
    });
    connections.value.push(created);
    showForm.value = false;
    Object.assign(form, {
      platform: '',
      authType: '',
      apiKey: '',
      oauthToken: '',
      oauthTokenSecret: '',
    });
  } catch {
    formError.value =
      'Failed to connect platform. Please check your credentials.';
  } finally {
    adding.value = false;
  }
}

async function remove(id: string) {
  if (!confirm('Remove this platform connection?')) return;
  try {
    await removeConnection(id);
    connections.value = connections.value.filter((c) => c.id !== id);
  } catch {
    alert('Failed to remove connection.');
  }
}

await load();
</script>

<style scoped>
.page {
  max-width: 700px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a2e;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.form-card {
  margin-bottom: 1.5rem;
}

.form-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.875rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.form-input:focus {
  border-color: #1a1a2e;
}

.form-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.state-message {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.state-error {
  color: #dc2626;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.connection-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.platform-icon {
  font-size: 1.5rem;
}

.platform-name {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.95rem;
}

.auth-meta {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.125rem;
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

.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  opacity: 0.85;
}
</style>
