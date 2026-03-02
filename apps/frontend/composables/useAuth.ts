import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '@monorepo/shared';

export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const token = useCookie<string | null>('auth_token', { default: () => null });
  const user = useState<UserProfile | null>('auth_user', () => null);

  const isAuthenticated = computed(() => !!token.value);

  async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await $fetch<AuthResponse>(`${apiBase}/auth/register`, {
      method: 'POST',
      body: payload,
    });
    token.value = data.token;
    user.value = data.user;
    return data;
  }

  async function login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await $fetch<AuthResponse>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: payload,
    });
    token.value = data.token;
    user.value = data.user;
    return data;
  }

  function logout() {
    token.value = null;
    user.value = null;
    navigateTo('/auth/login');
  }

  return { token, user, isAuthenticated, register, login, logout };
};
