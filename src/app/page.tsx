import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ── NAV ── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Mentice" width={32} height={32} className="h-8 w-auto" priority />
            <span className="text-lg font-bold text-slate-900 tracking-tight">Mentice</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500" aria-label="Main navigation">
            <a href="#home"         className="text-slate-900 border-b-2 border-blue-500 pb-0.5">Home</a>
            <a href="#challenge"    className="hover:text-slate-900 transition-colors">Challenge</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features"     className="hover:text-slate-900 transition-colors">Features</a>
          </nav>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:opacity-90"
          >
            Get Started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {/* ── HERO — fits exactly in viewport ── */}
      <section
        id="home"
        className="relative flex h-screen flex-col overflow-hidden pt-14"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/55" aria-hidden="true" />

        {/* Main grid */}
        <div className="relative flex flex-1 items-center">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">

              {/* ── LEFT — copy ── */}
              <div className="space-y-6">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-6xl">
                  Your mind.<br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                    Your performance.
                  </span>
                </h1>
                <p className="max-w-md text-lg text-slate-500 leading-relaxed">
                  Track your mood, manage stress, and build habits that help you perform at your best.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90 hover:shadow-xl"
                  >
                    Start Your Journey <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">▶</span>
                    See How It Works
                  </a>
                </div>

                {/* Feature pills */}
                <div id="features" className="flex flex-wrap gap-3 pt-2">
                  {[
                    { icon: "🧠", label: "Understand emotions" },
                    { icon: "🌿", label: "Manage stress" },
                    { icon: "🎯", label: "Stay focused" },
                    { icon: "📈", label: "Perform your best" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                      <span aria-hidden="true">{f.icon}</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT — stacked metric cards ── */}
              <div className="hidden lg:flex flex-col items-end gap-4">

                {/* Card 1 — Mood Today */}
                <div className="w-64 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200 border border-slate-100">
                  <p className="mb-2 text-xs font-medium text-slate-400 uppercase tracking-wide">Mood Today</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">🙂</div>
                    <span className="text-xl font-bold text-slate-900">Good</span>
                  </div>
                  <svg viewBox="0 0 160 36" className="w-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,28 Q20,22 40,24 Q60,26 80,14 Q100,8 120,16 Q140,20 160,10 L160,36 L0,36 Z" fill="url(#g1)"/>
                    <polyline points="0,28 40,24 80,14 120,16 160,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Card 2 — Stress Level */}
                <div className="w-64 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200 border border-slate-100">
                  <p className="mb-1 text-xs font-medium text-slate-400 uppercase tracking-wide">Stress Level</p>
                  <p className="mb-3 text-xl font-bold text-slate-900">Low</p>
                  <svg viewBox="0 0 160 28" className="w-full" aria-hidden="true">
                    <path d="M0,14 Q20,4 40,14 Q60,24 80,14 Q100,4 120,14 Q140,24 160,14" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Card 3 — Focus Time */}
                <div className="w-64 rounded-2xl bg-white p-4 shadow-lg shadow-slate-200 border border-slate-100">
                  <p className="mb-1 text-xs font-medium text-slate-400 uppercase tracking-wide">Focus Time</p>
                  <p className="text-3xl font-bold text-slate-900">2h 15m</p>
                  <div className="mt-3 flex items-end justify-between gap-1">
                    <p className="text-xs text-slate-400">Today</p>
                    <div className="flex items-end gap-1" aria-hidden="true">
                      {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
                        <div key={i} className="w-3 rounded-sm bg-blue-500" style={{ height: `${h * 0.32}px` }} />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Privacy badge — pinned to bottom */}
        <div className="relative flex justify-center pb-6">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-xs text-slate-500 shadow-sm backdrop-blur-sm">
            <span aria-hidden="true">🛡️</span>
            Private. Secure. Built for Students.
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-slate-500">Three simple steps to build mental wellness habits alongside your exam prep.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", icon: "✍️", title: "Daily Check-in", desc: "Rate your mood and flag what's weighing on you — takes under a minute." },
              { step: "02", icon: "📊", title: "Track Patterns",  desc: "See your mood trends, streaks, and most common stress triggers over time." },
              { step: "03", icon: "🤖", title: "AI Support",      desc: "Get personalised insights and talk to Menti, your AI wellness coach." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="absolute right-4 top-4 text-4xl font-black text-slate-100 select-none">{s.step}</span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">{s.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE ── */}
      <section id="challenge" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-center text-3xl font-bold text-slate-900">Built for Exam Warriors</h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-slate-500">Preparing for JEE, NEET, CUET, CAT, GATE, UPSC, or board exams? Mentice is designed for you.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: "😰", label: "Exam Anxiety",        desc: "Track patterns that trigger your anxiety and learn to manage them." },
              { icon: "🔥", label: "Burnout Prevention",  desc: "Daily check-ins catch burnout early, before it derails your prep." },
              { icon: "🧘", label: "Calm Under Pressure", desc: "Breathing exercises and grounding techniques — available any time." },
            ].map((c) => (
              <div key={c.label} className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-6">
                <span className="text-3xl">{c.icon}</span>
                <h3 className="font-bold text-slate-900">{c.label}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-teal-500 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Your wellbeing is your biggest competitive advantage.</h2>
          <p className="mb-8 text-blue-100">Join students who track their mental wellness alongside their studies.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-lg transition hover:shadow-xl hover:scale-105"
          >
            Start Free Today <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Mentice" width={24} height={24} className="h-6 w-auto" />
            <span className="font-bold text-slate-900">Mentice</span>
          </div>
          <p className="text-sm text-slate-400">Mental Wellness for Indian Students · PromptWars 2026</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/login"  className="hover:text-slate-700">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-700">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
