import { Hono } from 'hono';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import { ClickTrackingService } from '../services/clickTrackingService';
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
 * Click tracking API router
 * All routes require authentication
 */
export const clicksRouter = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all routes
clicksRouter.use('*', entraIdAuth());

/**
 * GET /api/clicks/:code - Get click records for a short URL
 */
clicksRouter.get('/:code', async (c) => {
  const code = c.req.param('code');
  const limit = parseInt(c.req.query('limit') ?? '100', 10);
  
  const service = new ClickTrackingService(c.env.CLICKS_DB);
  const clicks = await service.getClicksByCode(code, Math.min(limit, 1000));
  
  return c.json(clicks);
});

/**
 * GET /api/clicks/:code/count - Get click count for a short URL
 */
clicksRouter.get('/:code/count', async (c) => {
  const code = c.req.param('code');
  
  const service = new ClickTrackingService(c.env.CLICKS_DB);
  const count = await service.getClickCount(code);
  
  return c.json({ code, count });
});

/**
 * GET /api/clicks/stats - Get click statistics for all short URLs
 */
clicksRouter.get('/stats', async (c) => {
  const service = new ClickTrackingService(c.env.CLICKS_DB);
  const stats = await service.getClickStats();
  
  return c.json(stats);
});
