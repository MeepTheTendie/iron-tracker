// SvelteKit-compatible auth configuration
// Using the base convexAuth from @convex-dev/auth/server (not the Next.js version)
export const authConfig = {
  providers: [
    {
      id: "github",
      name: "GitHub",
      type: "oauth",
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email" },
      },
      token: "https://github.com/login/oauth/access_token",
      userinfo: "https://api.github.com/user",
      profile(profile: any) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    },
  ],
};

// Simple auth helper for SvelteKit
export const auth = {
  api: {
    async getSession({ headers }: { headers: Headers }) {
      // For now, return null to allow build to complete
      // In production, implement proper session validation
      const cookie = headers.get("cookie");
      if (!cookie) {
        return null;
      }
      // Parse the convex auth token from cookies
      const match = cookie.match(/convex_auth_token=([^;]+)/);
      if (!match) {
        return null;
      }
      // Return a mock session for build purposes
      // TODO: Implement proper token validation with Convex
      return {
        user: null,
      };
    },

    async signIn({ headers, body }: { headers: Headers; body: any }) {
      // Return a redirect to GitHub OAuth
      const clientId = process.env.GITHUB_CLIENT_ID;
      const redirectUri = `${process.env.PUBLIC_URL || "http://localhost:3000"}/api/auth/callback/github`;
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email`;
      
      return {
        status: 302,
        headers: {
          Location: githubAuthUrl,
        },
      };
    },

    async signOut({ headers }: { headers: Headers }) {
      // Clear the auth cookie
      return {
        status: 200,
        headers: {
          "Set-Cookie": "convex_auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
        },
      };
    },
  },
};
