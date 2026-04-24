import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-foreground opacity-70 hover:opacity-100 transition-opacity">
          <Image
            src="/venora-logo.svg"
            alt="Venora"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
        </Link>
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Venora. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-medium text-foreground">Venora</span>
        </p>
      </div>
    </footer>
  );
}
