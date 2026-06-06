import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen flex-col items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-blue-50/50 via-slate-50 to-teal-50/30">
      <Link href="/" className="mb-6 flex flex-col items-center gap-1.5 hover:opacity-90 transition-opacity">
        <Image src="/logo.png" alt="Mentice" width={44} height={44} className="h-11 w-auto" priority />
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">mentice</span>
        <p className="text-sm font-medium text-slate-500">Your mental wellness companion</p>
      </Link>
      {children}
    </main>
  );
}
