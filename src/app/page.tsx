import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* ── NAV ── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Mentice logo" width={36} height={36} className="h-9 w-auto" priority />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Mentice</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600" aria-label="Main navigation">
            <a href="#home" className="text-slate-900 border-b-2 border-blue-500 pb-0.5">Home</a>
            <a href="#challenge" className="hover:text-slate-900 transition-colors">Challenge</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          </nav>

          {/* CTA */}
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:opacity-90"
          >
            Get Started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen overflow-hidden pt-20"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Subtle overlay to keep text readable */}
        <div className="absolute inset-0 bg-white/60" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left — copy */}
            <div className="space-y-7">
              <div>
                <h1 className="text-6xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-7xl">
                  Your mind.
                </h1>
                <h1 className="text-6xl font-extrabold leading-tight tracking-tight sm:text-7xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                  Your performance.
                </h1>
              </div>

              <p className="max-w-md text-lg text-slate-600 leading-relaxed">
                Track your mood, manage stress, and build habits that help you perform at your best.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:opacity-90"
                >
                  Start Your Journey <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">▶</span>
                  See How It Works
                </a>
              </div>

              {/* Feature icons */}
              <div id="features" className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4 sm:grid-cols-4">
                {[
                  { icon: "🧠", label: "Understand your emotions" },
                  { icon: "🌿", label: "Manage stress effectively" },
                  { icon: "🎯", label: "Stay focused during exams" },
                  { icon: "📈", label: "Perform your best" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl shadow-sm">
                      {f.icon}
                    </div>
                    <p className="text-xs font-medium leading-tight text-slate-600">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="relative hidden lg:flex items-center justify-center h-[520px]">

              {/* Brain illustration */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
                <svg viewBox="0 0 320 320" className="w-72 h-72 opacity-20" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                  <ellipse cx="160" cy="130" rx="100" ry="90" />
                  <path d="M160 130 Q120 80 100 60 Q80 40 90 20 Q110 10 130 30 Q150 50 160 130" />
                  <path d="M160 130 Q200 80 220 60 Q240 40 230 20 Q210 10 190 30 Q170 50 160 130" />
                  <path d="M80 120 Q60 100 55 80 Q50 60 70 55 Q85 52 95 70" />
                  <path d="M240 120 Q260 100 265 80 Q270 60 250 55 Q235 52 225 70" />
                  <path d="M100 160 Q80 170 75 190 Q72 210 90 215" />
                  <path d="M220 160 Q240 170 245 190 Q248 210 230 215" />
                  <path d="M120 200 Q130 220 160 220 Q190 220 200 200" />
                  <line x1="160" y1="60" x2="160" y2="290" strokeDasharray="4 6" strokeOpacity="0.4" />
                </svg>
              </div>

              {/* Card — Mood Today */}
              <div className="absolute top-12 right-4 w-52 rounded-2xl bg-white p-4 shadow-xl shadow-slate-200 border border-slate-100">
                <p className="mb-2 text-xs font-medium text-slate-400">Mood Today</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">
                    🙂
                  </div>
                  <span className="text-lg font-bold text-slate-900">Good</span>
                </div>
                {/* Mini sparkline */}
                <svg viewBox="0 0 120 30" className="mt-3 w-full" aria-hidden="true">
                  <polyline
                    points="0,25 20,18 40,22 60,12 80,16 100,8 120,14"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Card — Stress Level */}
              <div className="absolute top-56 right-0 w-52 rounded-2xl bg-white p-4 shadow-xl shadow-slate-200 border border-slate-100">
                <p className="mb-1 text-xs font-medium text-slate-400">Stress Level</p>
                <p className="text-lg font-bold text-slate-900">Low</p>
                {/* Wave */}
                <svg viewBox="0 0 120 30" className="mt-3 w-full" aria-hidden="true">
                  <path
                    d="M0,15 Q15,5 30,15 Q45,25 60,15 Q75,5 90,15 Q105,25 120,15"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Card — Focus Time */}
              <div className="absolute bottom-20 right-8 w-52 rounded-2xl bg-white p-4 shadow-xl shadow-slate-200 border border-slate-100">
                <p className="mb-1 text-xs font-medium text-slate-400">Focus Time</p>
                <p className="text-3xl font-bold text-slate-900">2h 15m</p>
                <div className="mt-2 flex items-end justify-between gap-1">
                  <p className="text-xs text-slate-400">Today</p>
                  {/* Bar chart */}
                  <div className="flex items-end gap-1" aria-hidden="true">
                    {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-sm bg-blue-500 opacity-80"
                        style={{ height: `${h * 0.3}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="relative mx-auto flex max-w-7xl justify-center px-6 pb-12">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm text-slate-500 shadow-sm backdrop-blur-sm">
            <span aria-hidden="true">🛡️</span>
            <span>Private. Secure. Built for Students.</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-slate-500">
            Three simple steps to build better mental wellness habits during your exam prep.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", icon: "✍️", title: "Daily Check-in", desc: "Rate your mood and flag what's weighing on you — takes under a minute." },
              { step: "02", icon: "📊", title: "Track Patterns", desc: "See your mood trends, streaks, and most common stress triggers over time." },
              { step: "03", icon: "🤖", title: "AI Support", desc: "Get personalised insights and talk to Menti, your AI wellness coach." },
            ].map((s) => (
              <div key={s.step} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="absolute right-4 top-4 text-4xl font-black text-slate-100">{s.step}</span>
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
          <h2 className="mb-4 text-center text-3xl font-bold text-slate-900">Built for Exam Warriors</h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-slate-500">
            Preparing for JEE, NEET, CUET, CAT, GATE, UPSC, or board exams? You face unique pressures. Mentice is designed specifically for you.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: "😰", label: "Exam Anxiety", desc: "Track patterns that trigger your anxiety and learn to manage them." },
              { icon: "🔥", label: "Burnout Prevention", desc: "Daily check-ins catch burnout early, before it derails your preparation." },
              { icon: "🧘", label: "Calm Under Pressure", desc: "Breathing exercises and grounding techniques available any time." },
            ].map((c) => (
              <div key={c.label} className="flex flex-col items-start gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-teal-50 p-6">
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
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Your wellbeing is your biggest competitive advantage.
          </h2>
          <p className="mb-8 text-blue-100">Join students who track their mental wellness alongside their studies.</p>
          <Link
            href="/signup"
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
            <Image src="/logo.png" alt="Mentice logo" width={28} height={28} className="h-7 w-auto" />
            <span className="font-bold text-slate-900">Mentice</span>
          </div>
          <p className="text-sm text-slate-400">Mental Wellness for Indian Students · Built for PromptWars 2026</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/login" className="hover:text-slate-700">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-700">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
