import type { LayoutServerLoad } from "./$types";
import { getSession } from "$lib/server/auth";

export const load: LayoutServerLoad = async (event) => {
  const session = await getSession(event.request.headers);

  return {
    isAuthenticated: !!session?.user,
    user: session?.user || null,
  };
};
