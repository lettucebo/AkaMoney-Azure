import type { KVNamespace } from '@cloudflare/workers-types';
import type { ShortUrl, CreateShortUrlRequest, UpdateShortUrlRequest } from '../models/shortUrl';

/**
 * Service for managing short URLs using Cloudflare KV
 */
export class ShortUrlService {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  /**
   * Generate a random short URL code
   * @param length Code length (default: 6)
   */
  generateCode(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Check if a code is available (not already in use)
   */
  async isCodeAvailable(code: string): Promise<boolean> {
    const existing = await this.kv.get(code.toLowerCase());
    return existing === null;
  }

  /**
   * Create a new short URL
   */
  async create(request: CreateShortUrlRequest): Promise<ShortUrl> {
    let code = request.code?.toLowerCase();
    
    // Generate code if not provided
    if (!code) {
      do {
        code = this.generateCode();
      } while (!(await this.isCodeAvailable(code)));
    } else {
      // Validate custom code
      if (!/^[a-z0-9-]+$/.test(code)) {
        throw new Error('Code can only contain lowercase letters, numbers, and hyphens');
      }
      if (!(await this.isCodeAvailable(code))) {
        throw new Error('Code is already in use');
      }
    }

    const shortUrl: ShortUrl = {
      code,
      targetUrl: request.targetUrl,
      title: request.title ?? null,
      description: request.description ?? null,
      imageUrl: request.imageUrl ?? null,
      createdAt: new Date().toISOString(),
      expirationDate: request.expirationDate ?? null,
      isArchived: false,
      clickCount: 0,
    };

    await this.kv.put(code, JSON.stringify(shortUrl));
    return shortUrl;
  }

  /**
   * Get a short URL by code
   */
  async getByCode(code: string): Promise<ShortUrl | null> {
    const data = await this.kv.get(code.toLowerCase());
    if (!data) return null;
    return JSON.parse(data) as ShortUrl;
  }

  /**
   * Get a short URL for redirect (excludes archived and expired)
   */
  async getForRedirect(code: string): Promise<ShortUrl | null> {
    const shortUrl = await this.getByCode(code);
    if (!shortUrl) return null;
    if (shortUrl.isArchived) return null;
    if (shortUrl.expirationDate && new Date(shortUrl.expirationDate) < new Date()) {
      return null;
    }
    return shortUrl;
  }

  /**
   * Get all short URLs (non-archived)
   * Note: KV list has limitations, consider pagination for large datasets
   */
  async getAll(): Promise<ShortUrl[]> {
    const keys = await this.kv.list();
    const shortUrls: ShortUrl[] = [];

    for (const key of keys.keys) {
      const data = await this.kv.get(key.name);
      if (data) {
        const shortUrl = JSON.parse(data) as ShortUrl;
        if (!shortUrl.isArchived) {
          shortUrls.push(shortUrl);
        }
      }
    }

    // Sort by createdAt descending
    return shortUrls.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Update a short URL
   */
  async update(code: string, request: UpdateShortUrlRequest): Promise<ShortUrl | null> {
    const shortUrl = await this.getByCode(code);
    if (!shortUrl) return null;

    const updated: ShortUrl = {
      ...shortUrl,
      targetUrl: request.targetUrl ?? shortUrl.targetUrl,
      title: request.title !== undefined ? request.title : shortUrl.title,
      description: request.description !== undefined ? request.description : shortUrl.description,
      imageUrl: request.imageUrl !== undefined ? request.imageUrl : shortUrl.imageUrl,
      expirationDate: request.expirationDate !== undefined ? request.expirationDate : shortUrl.expirationDate,
    };

    await this.kv.put(code.toLowerCase(), JSON.stringify(updated));
    return updated;
  }

  /**
   * Archive (soft delete) a short URL
   */
  async archive(code: string): Promise<boolean> {
    const shortUrl = await this.getByCode(code);
    if (!shortUrl) return false;

    shortUrl.isArchived = true;
    await this.kv.put(code.toLowerCase(), JSON.stringify(shortUrl));
    return true;
  }

  /**
   * Increment click count for a short URL
   */
  async incrementClickCount(code: string): Promise<void> {
    const shortUrl = await this.getByCode(code);
    if (!shortUrl) return;

    shortUrl.clickCount += 1;
    await this.kv.put(code.toLowerCase(), JSON.stringify(shortUrl));
  }
}
