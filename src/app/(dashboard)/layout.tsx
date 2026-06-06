import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HELPLINES } from "@/lib/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">

      {/* ── Top nav ── */}
      <header className="shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-5 py-3">

          {/* Left — logo */}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <Image src="/logo.png" alt="Mentice" width={26} height={26} className="h-6 w-auto" />
            <span className="text-base font-bold tracking-tight text-indigo-600">mentice</span>
          </Link>

          {/* Center — nav links */}
          <nav className="flex items-center justify-center gap-0.5 text-sm" aria-label="Main navigation">
            {[
              { href: "/dashboard", label: "Home",     icon: "🏠" },
              { href: "/checkin",   label: "Check-in", icon: "✍️" },
              { href: "/chat",      label: "AI Coach", icon: "🤖" },
              { href: "/breathe",   label: "Breathe",  icon: "🫁" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="text-base leading-none" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right — sign out */}
          <div className="flex justify-end">
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="mx-auto max-w-6xl px-5 py-6">
          {children}
        </div>
      </main>

      {/* ── Crisis strip — always visible ── */}
      <footer className="shrink-0 border-t border-rose-100 bg-rose-50 px-5 py-2.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1">
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wide">🆘 Need help?</span>
          {HELPLINES.map((h) => (
            <span key={h.name} className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{h.name}:</span>{" "}
              <a href={`tel:${h.number.replace(/-/g, "")}`} className="text-indigo-600 hover:underline" aria-label={`Call ${h.name}`}>
                {h.number}
              </a>{" "}
              <span className="text-slate-400">({h.desc})</span>
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
