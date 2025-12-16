import { Hono } from 'hono';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import { ShortUrlService } from '../services/shortUrlService';
import { ClickTrackingService } from '../services/clickTrackingService';
import type { CreateShortUrlRequest, UpdateShortUrlRequest } from '../models/shortUrl';
import { entraIdAuth } from '../middleware/auth';

/**
 * Environment bindings
 */
interface Env {
  SHORTURL_KV: KVNamespace;
  CLICKS_DB: D1Database;
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
}

/**
 * Short URL API router
 * All routes require authentication
 */
export const shortUrlRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
shortUrlRouter.use('*', entraIdAuth());

/**
 * GET /api/shorturl - Get all short URLs
 */
shortUrlRouter.get('/', async (c) => {
  const service = new ShortUrlService(c.env.SHORTURL_KV);
  const shortUrls = await service.getAll();
  return c.json(shortUrls);
});

/**
 * GET /api/shorturl/generate - Generate a random code
 */
shortUrlRouter.get('/generate', async (c) => {
  const service = new ShortUrlService(c.env.SHORTURL_KV);
  let code: string;
  do {
    code = service.generateCode();
  } while (!(await service.isCodeAvailable(code)));
  return c.json({ code });
});

/**
 * GET /api/shorturl/:code - Get a short URL by code
 */
shortUrlRouter.get('/:code', async (c) => {
  const code = c.req.param('code');
  const service = new ShortUrlService(c.env.SHORTURL_KV);
  const shortUrl = await service.getByCode(code);
  
  if (!shortUrl) {
    return c.json({ error: 'Short URL not found' }, 404);
  }
  
  return c.json(shortUrl);
});

/**
 * POST /api/shorturl - Create a new short URL
 */
shortUrlRouter.post('/', async (c) => {
  try {
    const request = await c.req.json<CreateShortUrlRequest>();
    
    if (!request.targetUrl) {
      return c.json({ error: 'targetUrl is required' }, 400);
    }

    // Validate URL format
    try {
      new URL(request.targetUrl);
    } catch {
      return c.json({ error: 'Invalid targetUrl format' }, 400);
    }

    const service = new ShortUrlService(c.env.SHORTURL_KV);
    const shortUrl = await service.create(request);
    return c.json(shortUrl, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

/**
 * PUT /api/shorturl/:code - Update a short URL
 */
shortUrlRouter.put('/:code', async (c) => {
  const code = c.req.param('code');
  
  try {
    const request = await c.req.json<UpdateShortUrlRequest>();
    
    // Validate URL format if provided
    if (request.targetUrl) {
      try {
        new URL(request.targetUrl);
      } catch {
        return c.json({ error: 'Invalid targetUrl format' }, 400);
      }
    }

    const service = new ShortUrlService(c.env.SHORTURL_KV);
    const shortUrl = await service.update(code, request);
    
    if (!shortUrl) {
      return c.json({ error: 'Short URL not found' }, 404);
    }
    
    return c.json(shortUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

/**
 * DELETE /api/shorturl/:code - Archive (soft delete) a short URL
 */
shortUrlRouter.delete('/:code', async (c) => {
  const code = c.req.param('code');
  const service = new ShortUrlService(c.env.SHORTURL_KV);
  const success = await service.archive(code);
  
  if (!success) {
    return c.json({ error: 'Short URL not found' }, 404);
  }
  
  return c.json({ message: 'Short URL archived successfully' });
});
