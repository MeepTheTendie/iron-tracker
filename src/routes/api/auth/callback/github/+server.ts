import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '/';
  
  if (!code) {
    throw redirect(302, '/login?error=no_code');
  }
  
  // Exchange code for token and create session
  // For now, just redirect to home
  throw redirect(302, state);
};
