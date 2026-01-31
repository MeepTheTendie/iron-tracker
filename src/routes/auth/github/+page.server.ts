import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  throw redirect(302, `/api/auth/signin/github?callbackUrl=${url.origin}`);
};
