import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

let convex: ConvexReactClient | null = null;

if (convexUrl) {
  convex = new ConvexReactClient(convexUrl);
} else if (import.meta.env.DEV) {
  console.warn(
    "Missing VITE_CONVEX_URL. Run `npx convex dev` to set up Convex.",
  );
}

export { convex };
