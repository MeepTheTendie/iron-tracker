import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:5173';

export function signIn(provider: string, callbackUrl: string = '/') {
  if (provider !== 'github') {
    throw new Error('Unsupported provider');
  }
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${PUBLIC_URL}/api/auth/callback/github`)}&scope=read:user%20user:email&state=${encodeURIComponent(callbackUrl)}`;
  
  throw redirect(302, githubAuthUrl);
}

export function signOut() {
  throw redirect(302, '/');
}

export async function getSession(headers: Headers) {
  const cookie = headers.get('cookie');
  if (!cookie) return { user: null };
  
  const match = cookie.match(/convex_auth_token=([^;]+)/);
  if (!match) return { user: null };
  
  // TODO: Implement proper token validation
  return { user: null };
}
