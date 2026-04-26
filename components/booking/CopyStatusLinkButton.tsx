"use client";

import { Button } from "@/components/ui/button";
import { Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  url: string;
}

export function CopyStatusLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full sm:w-auto rounded-full
                 border border-border hover:bg-muted
                 transition-all duration-300 hover:scale-[1.02]
                 px-8 py-6"
    >
      {copied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Link2 className="mr-2 h-4 w-4" />
      )}
      {copied ? "Copied" : "Check Status Anytime"}
    </Button>
  );
}
