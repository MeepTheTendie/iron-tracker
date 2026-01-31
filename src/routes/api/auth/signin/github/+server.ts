import type { PageServerLoad } from './$types';
import { signIn } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const state = url.searchParams.get('state') || '/';
  signIn('github', state);
};
