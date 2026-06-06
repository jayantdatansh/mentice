import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config — no Prisma, no Node-only imports.
 * Used by the proxy (middleware) to protect routes via JWT only.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const publicPaths = ["/", "/login", "/signup", "/api/auth"];
      const isPublic =
        pathname === "/" || publicPaths.some((p) => p !== "/" && pathname.startsWith(p));

      if (!isLoggedIn && !isPublic) return false; // redirect to signIn page
      if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
