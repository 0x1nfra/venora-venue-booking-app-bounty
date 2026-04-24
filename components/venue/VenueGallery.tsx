import Image from "next/image";

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

  const [main, ...thumbs] = images;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-xl overflow-hidden">
      {/* Main large image */}
      <div className="col-span-3 row-span-2 relative">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
      {/* 3 small thumbnails */}
      {thumbs.slice(0, 3).map((img, i) => (
        <div key={i} className="relative col-span-1 row-span-1">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="20vw"
          />
        </div>
      ))}
    </div>
  );
}
