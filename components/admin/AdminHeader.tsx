"use client";

import Image from "next/image";
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
    <header className="border-b bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/venora-logo.svg"
              alt="Venora"
              width={100}
              height={28}
              className="h-7 w-auto"
            />
            <span className="text-sm font-medium text-muted-foreground border-l pl-2 ml-1">
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
