/**
 * Click tracking information
 */
export interface ClickInfo {
  /** Unique click ID */
  id: string;
  /** The short URL code that was clicked */
  code: string;
  /** Browser User Agent string */
  userAgent: string | null;
  /** HTTP Referer header */
  referrer: string | null;
  /** Client IP address */
  ipAddress: string | null;
  /** Click timestamp (ISO 8601) */
  timestamp: string;
}

/**
 * Click statistics summary
 */
export interface ClickStats {
  /** The short URL code */
  code: string;
  /** Total number of clicks */
  totalClicks: number;
}
