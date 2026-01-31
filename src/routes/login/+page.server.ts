import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
  default: async (event) => {
    return auth.api.signIn({
      headers: event.request.headers,
      body: {
        provider: "github",
        callbackURL: "/",
      },
    });
  },
};
