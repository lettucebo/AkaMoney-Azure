import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import { shortUrlRouter } from './handlers/shorturl';
import { redirectRouter } from './handlers/redirect';
import { clicksRouter } from './handlers/clicks';

/**
 * Environment bindings for Cloudflare Workers
 */
export interface Env {
  /** KV namespace for storing short URLs */
  SHORTURL_KV: KVNamespace;
  /** D1 database for click tracking */
  CLICKS_DB: D1Database;
  /** Azure Entra ID Tenant ID */
  AZURE_TENANT_ID: string;
  /** Azure Entra ID Client ID (API application) */
  AZURE_CLIENT_ID: string;
}

/**
 * Main Hono application
 */
const app = new Hono<{ Bindings: Env }>();

// Enable CORS for frontend access
app.use('*', cors({
  origin: ['http://localhost:8080', 'https://*.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'akamoney-api'
  });
});

// API routes (require authentication)
app.route('/api/shorturl', shortUrlRouter);
app.route('/api/clicks', clicksRouter);

// Redirect routes (public access) - must be last to avoid conflicts
app.route('/', redirectRouter);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
