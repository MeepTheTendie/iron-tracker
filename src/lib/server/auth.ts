import { redirect } from '@sveltejs/kit';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:5173';

export function getGitHubAuthUrl(callbackUrl: string = '/'): string {
  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${PUBLIC_URL}/api/auth/callback/github`)}&scope=read:user%20user:email&state=${encodeURIComponent(callbackUrl)}`;
}

export function signIn(provider: string, callbackUrl: string = '/') {
  if (provider !== 'github') {
    throw new Error('Unsupported provider');
  }
  throw redirect(302, getGitHubAuthUrl(callbackUrl));
}

export function signOut() {
  throw redirect(302, '/');
}
