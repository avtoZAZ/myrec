import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-cream/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">MyRec</Link>
        <div className="flex gap-4 text-sm">
          <Link href="/recipes">Каталог</Link>
          <Link href="/admin">Админка</Link>
        </div>
      </nav>
    </header>
  );
}
