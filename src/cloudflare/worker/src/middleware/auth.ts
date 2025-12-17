import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { Context, Next } from 'hono';

/**
 * Microsoft Entra ID JWT token payload
 */
export interface EntraIdTokenPayload extends JWTPayload {
  /** Azure AD Tenant ID */
  tid?: string;
  /** Object ID of the user */
  oid?: string;
  /** User Principal Name */
  upn?: string;
  /** Display name */
  name?: string;
  /** Email address */
  email?: string;
  /** Application ID (client_id) */
  azp?: string;
  /** Scope */
  scp?: string;
}

/**
 * Auth context added to Hono context
 */
export interface AuthContext {
  /** JWT token payload */
  payload: EntraIdTokenPayload;
  /** User ID (oid from token) */
  userId: string;
  /** User email */
  email: string | null;
  /** User display name */
  name: string | null;
}

// Cache for JWKS
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Get Microsoft Entra ID JWKS (JSON Web Key Set)
 */
function getJWKS(tenantId: string) {
  if (!jwksCache) {
    const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
    jwksCache = createRemoteJWKSet(new URL(jwksUri));
  }
  return jwksCache;
}

/**
 * Verify Microsoft Entra ID JWT token
 */
export async function verifyEntraIdToken(
  token: string,
  tenantId: string,
  clientId: string
): Promise<EntraIdTokenPayload> {
  const jwks = getJWKS(tenantId);
  
  const { payload } = await jwtVerify(token, jwks, {
    issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
    audience: clientId,
  });

  return payload as EntraIdTokenPayload;
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
  return parts[1];
}

/**
 * Environment bindings with auth configuration
 */
interface AuthEnv {
  AZURE_TENANT_ID: string;
  AZURE_CLIENT_ID: string;
}

/**
 * Variables type for auth context
 */
type AuthVariables = {
  auth: AuthContext;
};

/**
 * Hono middleware for Entra ID JWT authentication
 * Protects routes by requiring valid JWT token
 */
export function entraIdAuth() {
  return async (c: Context<{ Bindings: AuthEnv; Variables: AuthVariables }>, next: Next) => {
    const tenantId = c.env.AZURE_TENANT_ID;
    const clientId = c.env.AZURE_CLIENT_ID;

    if (!tenantId || !clientId) {
      console.error('Missing AZURE_TENANT_ID or AZURE_CLIENT_ID environment variables');
      return c.json({ error: 'Server configuration error' }, 500);
    }

    const authHeader = c.req.header('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }

    try {
      const payload = await verifyEntraIdToken(token, tenantId, clientId);
      
      // Add auth context to Hono context
      const authContext: AuthContext = {
        payload,
        userId: payload.oid ?? '',
        email: payload.email ?? payload.upn ?? null,
        name: payload.name ?? null,
      };
      
      c.set('auth', authContext);
      await next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
  };
}

/**
 * Get auth context from Hono context
 */
export function getAuthContext(c: Context<{ Variables: AuthVariables }>): AuthContext | null {
  return c.get('auth') as AuthContext | null;
}
