<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/dashboard" class="back-link"> ← Dashboard </NuxtLink>
      <h1 class="page-title">Create Content</h1>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="Post title"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Body</label>
          <textarea
            v-model="form.body"
            class="form-input form-textarea"
            placeholder="Write your post content…"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Media URL (optional)</label>
          <input
            v-model="form.mediaUrl"
            type="url"
            class="form-input"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <p v-if="error" class="form-error">
          {{ error }}
        </p>
        <div class="form-actions">
          <NuxtLink to="/dashboard" class="btn btn-secondary">
            Cancel
          </NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving…' : 'Save as Draft' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' });

const { createContent } = useContent();
const router = useRouter();

const form = reactive({ title: '', body: '', mediaUrl: '' });
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  try {
    const item = await createContent({
      title: form.title,
      body: form.body,
      mediaUrl: form.mediaUrl || undefined,
    });
    await router.push(`/content/${item.id}/publish`);
  } catch {
    error.value = 'Failed to save content. Please try again.';
  } finally {
    loading.value = false;
  }
}
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

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
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
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #1a1a2e;
}

.form-textarea {
  min-height: 160px;
  resize: vertical;
}

.form-error {
  color: #dc2626;
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
