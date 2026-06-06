import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen flex-col items-center justify-center overflow-hidden px-4 bg-slate-950">
      <Link href="/" className="mb-6 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="Mentice" width={40} height={40} className="h-10 w-auto" priority />
        <span className="text-2xl font-bold tracking-tight text-indigo-400">mentice</span>
        <p className="text-sm text-slate-500">Your mental wellness companion</p>
      </Link>
      {children}
    </main>
  );
}
