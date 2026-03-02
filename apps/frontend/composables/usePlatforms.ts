import type {
  PlatformConnection,
  CreatePlatformConnectionPayload,
} from '@monorepo/shared';

export const usePlatforms = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const { token } = useAuth();

  function authHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  async function fetchConnections(): Promise<PlatformConnection[]> {
    return $fetch<PlatformConnection[]>(`${apiBase}/platform-connections`, {
      headers: authHeaders(),
    });
  }

  async function addConnection(
    payload: CreatePlatformConnectionPayload,
  ): Promise<PlatformConnection> {
    return $fetch<PlatformConnection>(`${apiBase}/platform-connections`, {
      method: 'POST',
      body: payload,
      headers: authHeaders(),
    });
  }

  async function removeConnection(id: string): Promise<void> {
    await $fetch(`${apiBase}/platform-connections/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
  }

  return { fetchConnections, addConnection, removeConnection };
};
