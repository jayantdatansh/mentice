export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold tracking-tight text-indigo-400">mentice</span>
        <p className="mt-1 text-sm text-slate-400">Your mental wellness companion</p>
      </div>
      {children}
    </main>
  );
}
