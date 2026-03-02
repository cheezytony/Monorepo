<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/dashboard" class="back-link"> ← Dashboard </NuxtLink>
      <h1 class="page-title">Publish Content</h1>
    </div>

    <div v-if="loadingContent || loadingConnections" class="state-message">
      Loading…
    </div>
    <div v-else-if="loadError" class="state-message state-error">
      {{ loadError }}
    </div>
    <template v-else>
      <!-- Content preview -->
      <div class="card preview-card">
        <h2 class="preview-title">
          {{ content?.title }}
        </h2>
        <p class="preview-body">
          {{ content?.body }}
        </p>
        <span class="status-badge" :class="`status-${content?.status}`">
          {{ content?.status }}
        </span>
      </div>

      <!-- Platform selection -->
      <div class="card">
        <h2 class="section-title">Choose Platforms</h2>

        <div v-if="connections.length === 0" class="no-connections">
          <p>
            You have no platform connections configured.
            <NuxtLink to="/platforms"> Add one now → </NuxtLink>
          </p>
        </div>
        <div v-else class="platform-list">
          <label
            v-for="conn in connections"
            :key="conn.id"
            class="platform-option"
            :class="{ selected: selected.includes(conn.id) }"
          >
            <input
              v-model="selected"
              type="checkbox"
              :value="conn.id"
              class="platform-checkbox"
            />
            <span class="platform-icon">{{ platformIcon(conn.platform) }}</span>
            <span class="platform-info">
              <span class="platform-name">{{
                platformLabel(conn.platform)
              }}</span>
              <span class="platform-cred">{{ conn.maskedCredential }}</span>
            </span>
          </label>
        </div>

        <p v-if="publishError" class="form-error">
          {{ publishError }}
        </p>
        <p v-if="successMsg" class="form-success">
          {{ successMsg }}
        </p>

        <div class="form-actions">
          <NuxtLink to="/dashboard" class="btn btn-secondary">
            Cancel
          </NuxtLink>
          <button
            class="btn btn-primary"
            :disabled="isPublishDisabled"
            @click="handlePublish"
          >
            {{ publishing ? 'Publishing…' : 'Publish' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  ContentItem,
  PlatformConnection,
  PlatformType,
} from '@monorepo/shared';

definePageMeta({ layout: 'default' });

const route = useRoute();
const id = route.params.id as string;

const { fetchOne, publishContent } = useContent();
const { fetchConnections } = usePlatforms();

const content = ref<ContentItem | null>(null);
const connections = ref<PlatformConnection[]>([]);
const selected = ref<string[]>([]);

const loadingContent = ref(true);
const loadingConnections = ref(true);
const loadError = ref('');
const publishing = ref(false);
const publishError = ref('');
const successMsg = ref('');

const isPublishDisabled = computed(
  () =>
    selected.value.length === 0 ||
    publishing.value ||
    content.value?.status === 'published',
);

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
  try {
    const [c, conns] = await Promise.all([
      fetchOne(id).finally(() => (loadingContent.value = false)),
      fetchConnections().finally(() => (loadingConnections.value = false)),
    ]);
    content.value = c;
    connections.value = conns;
  } catch {
    loadError.value = 'Failed to load data.';
    loadingContent.value = false;
    loadingConnections.value = false;
  }
}

async function handlePublish() {
  publishing.value = true;
  publishError.value = '';
  successMsg.value = '';
  try {
    const updated = await publishContent(id, {
      platformConnectionIds: selected.value,
    });
    content.value = updated;
    successMsg.value = 'Content published successfully!';
    selected.value = [];
  } catch {
    publishError.value = 'Publishing failed. Please try again.';
  } finally {
    publishing.value = false;
  }
}

await load();
</script>

<style scoped>
.page {
  max-width: 680px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.back-link:hover {
  color: #1a1a2e;
}

.page-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a2e;
}

.state-message {
  text-align: center;
  color: #6b7280;
  padding: 3rem 0;
}

.state-error {
  color: #dc2626;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
  margin-bottom: 1.25rem;
}

.preview-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.preview-body {
  color: #374151;
  font-size: 0.9rem;
  white-space: pre-line;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.no-connections {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.no-connections a {
  color: #1a1a2e;
  font-weight: 600;
}

.platform-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.platform-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.15s;
}

.platform-option.selected {
  border-color: #1a1a2e;
  background: #f9fafb;
}

.platform-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #1a1a2e;
}

.platform-icon {
  font-size: 1.25rem;
}

.platform-info {
  display: flex;
  flex-direction: column;
}

.platform-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a2e;
}

.platform-cred {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.form-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.form-success {
  color: #065f46;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.65rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.2s;
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

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}
</style>
