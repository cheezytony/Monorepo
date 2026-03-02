import type {
  ContentItem,
  CreateContentPayload,
  UpdateContentPayload,
  PublishContentPayload,
} from '@monorepo/shared';

export const useContent = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const { token } = useAuth();

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  async function fetchContent(): Promise<ContentItem[]> {
    return $fetch<ContentItem[]>(`${apiBase}/content`, {
      headers: authHeaders(),
    });
  }

  async function fetchOne(id: string): Promise<ContentItem> {
    return $fetch<ContentItem>(`${apiBase}/content/${id}`, {
      headers: authHeaders(),
    });
  }

  async function createContent(
    payload: CreateContentPayload,
  ): Promise<ContentItem> {
    return $fetch<ContentItem>(`${apiBase}/content`, {
      method: 'POST',
      body: payload,
      headers: authHeaders(),
    });
  }

  async function updateContent(
    id: string,
    payload: UpdateContentPayload,
  ): Promise<ContentItem> {
    return $fetch<ContentItem>(`${apiBase}/content/${id}`, {
      method: 'PUT',
      body: payload,
      headers: authHeaders(),
    });
  }

  async function deleteContent(id: string): Promise<void> {
    await $fetch(`${apiBase}/content/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  }

  async function publishContent(
    id: string,
    payload: PublishContentPayload,
  ): Promise<ContentItem> {
    return $fetch<ContentItem>(`${apiBase}/content/${id}/publish`, {
      method: 'POST',
      body: payload,
      headers: authHeaders(),
    });
  }

  return {
    fetchContent,
    fetchOne,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
  };
};
