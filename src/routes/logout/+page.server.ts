import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
  default: async (event) => {
    return auth.api.signOut({
      headers: event.request.headers,
    });
  },
};
