import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="mb-8 flex gap-4 text-sm">
      <Link
        href="/"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
      >
        Home
      </Link>

      <Link
        href="/admin"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
      >
        Admin Console
      </Link>
    </nav>
  );
}