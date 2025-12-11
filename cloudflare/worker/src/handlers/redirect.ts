import { Hono } from 'hono';
import type { KVNamespace, D1Database } from '@cloudflare/workers-types';
import { ShortUrlService } from '../services/shortUrlService';
import { ClickTrackingService } from '../services/clickTrackingService';

/**
 * Environment bindings
 */
interface Env {
  SHORTURL_KV: KVNamespace;
  CLICKS_DB: D1Database;
}

/**
 * Redirect router
 * No authentication required - public access
 */
export const redirectRouter = new Hono<{ Bindings: Env }>();

/**
 * GET /:code - Redirect to target URL
 */
redirectRouter.get('/:code', async (c) => {
  const code = c.req.param('code');
  const shortUrlService = new ShortUrlService(c.env.SHORTURL_KV);
  const shortUrl = await shortUrlService.getForRedirect(code);

  if (!shortUrl) {
    // Return 404 page or redirect to homepage
    return c.notFound();
  }

  // Track click asynchronously (don't wait for completion)
  const clickTrackingService = new ClickTrackingService(c.env.CLICKS_DB);
  
  // Use waitUntil to track click without blocking redirect
  c.executionCtx.waitUntil(
    (async () => {
      try {
        // Record click
        await clickTrackingService.recordClick(
          code,
          c.req.header('User-Agent') ?? null,
          c.req.header('Referer') ?? null,
          c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? null
        );
        
        // Increment click count in KV
        await shortUrlService.incrementClickCount(code);
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    })()
  );

  // Check if we need to render social preview meta tags
  const userAgent = c.req.header('User-Agent')?.toLowerCase() ?? '';
  const isSocialBot = 
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('linkedinbot') ||
    userAgent.includes('slackbot') ||
    userAgent.includes('telegrambot') ||
    userAgent.includes('discordbot') ||
    userAgent.includes('whatsapp');

  // If it's a social media bot and we have metadata, return HTML with OG tags
  if (isSocialBot && (shortUrl.title || shortUrl.description || shortUrl.imageUrl)) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(shortUrl.title ?? 'Redirect')}</title>
  <meta property="og:title" content="${escapeHtml(shortUrl.title ?? '')}">
  <meta property="og:description" content="${escapeHtml(shortUrl.description ?? '')}">
  ${shortUrl.imageUrl ? `<meta property="og:image" content="${escapeHtml(shortUrl.imageUrl)}">` : ''}
  <meta property="og:url" content="${escapeHtml(shortUrl.targetUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(shortUrl.title ?? '')}">
  <meta name="twitter:description" content="${escapeHtml(shortUrl.description ?? '')}">
  ${shortUrl.imageUrl ? `<meta name="twitter:image" content="${escapeHtml(shortUrl.imageUrl)}">` : ''}
  <meta http-equiv="refresh" content="0;url=${escapeHtml(shortUrl.targetUrl)}">
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(shortUrl.targetUrl)}">${escapeHtml(shortUrl.targetUrl)}</a></p>
</body>
</html>`;
    
    return c.html(html);
  }

  // Normal redirect
  return c.redirect(shortUrl.targetUrl, 302);
});

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
