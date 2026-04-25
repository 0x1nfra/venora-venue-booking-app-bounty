"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin/dashboard", label: "Bookings" },
  { href: "/admin/venue", label: "Venue" },
];

export function AdminHeader() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/login");
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-[0.5px] border-border shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="font-serif italic text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
            >
              Venora
            </Link>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  pathname === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
