"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const FALLBACK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", alt: "Grand Hall" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", alt: "Banquet Setup" },
  { src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80", alt: "Stage" },
  { src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80", alt: "Reception" },
];

export function VenueGallery({
  imageUrls,
  venueName,
}: {
  imageUrls: string[];
  venueName: string;
}) {
  const images =
    imageUrls.length > 0
      ? imageUrls.slice(0, 4).map((src, i) => ({ src, alt: `${venueName} ${i + 1}` }))
      : FALLBACK_IMAGES;

  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(null);

  const [main, ...thumbs] = images;

  return (
    <>
      <div className="rounded-xl overflow-hidden">
        {/* Mobile: single full-width image */}
        <button
          className="relative h-64 sm:h-80 md:hidden w-full cursor-pointer"
          onClick={() => setSelected(main)}
          aria-label={`View ${main.alt}`}
        >
          <Image
            src={main.src}
            alt={main.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </button>
        {/* Desktop: main + thumbnails grid */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
          <button
            className="col-span-3 row-span-2 relative cursor-pointer"
            onClick={() => setSelected(main)}
            aria-label={`View ${main.alt}`}
          >
            <Image
              src={main.src}
              alt={main.alt}
              fill
              className="object-cover"
              sizes="60vw"
              priority
            />
          </button>
          {thumbs.slice(0, 3).map((img, i) => (
            <button
              key={i}
              className="relative col-span-1 row-span-1 cursor-pointer"
              onClick={() => setSelected(img)}
              aria-label={`View ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black border-none">
          <DialogTitle className="sr-only">
            {selected?.alt ?? "Venue image"}
          </DialogTitle>
          {selected && (
            <div className="relative w-full aspect-video">
              <Image
                src={selected.src}
                alt={selected.alt}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
