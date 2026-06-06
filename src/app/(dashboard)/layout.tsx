import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HELPLINES } from "@/lib/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight text-indigo-400 hover:text-indigo-300"
          >
            mentice
          </Link>
          <nav className="flex items-center gap-4 text-sm" aria-label="Main navigation">
            <Link
              href="/dashboard"
              className="text-slate-300 transition hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/checkin"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white transition hover:bg-indigo-500"
            >
              Check-in
            </Link>
            <Link
              href="/breathe"
              className="text-slate-300 transition hover:text-white"
            >
              Breathe
            </Link>
            <Link
              href="/chat"
              className="text-slate-300 transition hover:text-white"
            >
              AI Coach
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-slate-400 transition hover:text-white"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8" id="main-content">
        {children}
      </main>

      {/* Crisis footer — always visible */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
            Need help? You are not alone.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {HELPLINES.map((h) => (
              <li key={h.name} className="text-sm text-slate-300">
                <span className="font-medium text-white">{h.name}:</span>{" "}
                <a
                  href={`tel:${h.number.replace(/-/g, "")}`}
                  className="text-indigo-400 underline-offset-2 hover:underline"
                  aria-label={`Call ${h.name} at ${h.number}`}
                >
                  {h.number}
                </a>{" "}
                <span className="text-slate-500">({h.desc})</span>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
