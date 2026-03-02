export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// ── Platform connections ──────────────────────────────────────────────────────

export type PlatformType = 'youtube' | 'instagram' | 'tiktok' | 'x';
export type AuthType = 'oauth' | 'api_key';

export interface PlatformConnection {
  id: string;
  platform: PlatformType;
  authType: AuthType;
  /** Last 4 characters of the credential – safe to display in the UI. */
  maskedCredential: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlatformConnectionPayload {
  platform: PlatformType;
  authType: AuthType;
  /** Required when authType is 'api_key'. */
  apiKey?: string;
  /** Required when authType is 'oauth'. */
  oauthToken?: string;
  oauthTokenSecret?: string;
}

// ── Content ───────────────────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'published' | 'failed';

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  mediaUrl?: string;
  status: ContentStatus;
  platforms: PlatformType[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentPayload {
  title: string;
  body: string;
  mediaUrl?: string;
}

export interface UpdateContentPayload {
  title?: string;
  body?: string;
  mediaUrl?: string;
}

export interface PublishContentPayload {
  /** IDs of the platform connections to publish to. */
  platformConnectionIds: string[];
}
