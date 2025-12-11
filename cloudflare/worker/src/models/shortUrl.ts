/**
 * Short URL data model
 */
export interface ShortUrl {
  /** The unique short URL code (lowercase) */
  code: string;
  /** The target URL to redirect to */
  targetUrl: string;
  /** Social sharing title */
  title: string | null;
  /** Social sharing description */
  description: string | null;
  /** Social sharing image URL */
  imageUrl: string | null;
  /** Creation timestamp (ISO 8601) */
  createdAt: string;
  /** Expiration timestamp (ISO 8601), null if no expiration */
  expirationDate: string | null;
  /** Whether the short URL is archived (soft deleted) */
  isArchived: boolean;
  /** Total click count */
  clickCount: number;
}

/**
 * Request payload for creating a short URL
 */
export interface CreateShortUrlRequest {
  /** Optional custom code, will be auto-generated if not provided */
  code?: string;
  /** The target URL to redirect to (required) */
  targetUrl: string;
  /** Social sharing title */
  title?: string;
  /** Social sharing description */
  description?: string;
  /** Social sharing image URL */
  imageUrl?: string;
  /** Expiration timestamp (ISO 8601) */
  expirationDate?: string;
}

/**
 * Request payload for updating a short URL
 */
export interface UpdateShortUrlRequest {
  /** The target URL to redirect to */
  targetUrl?: string;
  /** Social sharing title */
  title?: string | null;
  /** Social sharing description */
  description?: string | null;
  /** Social sharing image URL */
  imageUrl?: string | null;
  /** Expiration timestamp (ISO 8601) */
  expirationDate?: string | null;
}
