import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif italic text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Venora
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Venora. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-medium text-foreground">Vessl Tech</span>
          {" · "}
          <Link
            href="/admin/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
