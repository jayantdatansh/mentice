import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe proxy — only verifies JWT, never imports Prisma
export const { auth: default_export } = NextAuth(authConfig);
export default default_export;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
