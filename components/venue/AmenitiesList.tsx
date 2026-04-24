import { Wifi, Car, Wind, Tv, ChefHat, Sparkles, Music2, Users2 } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  aircon: <Wind className="w-5 h-5" />,
  av_equipment: <Tv className="w-5 h-5" />,
  catering_kitchen: <ChefHat className="w-5 h-5" />,
  bridal_suite: <Sparkles className="w-5 h-5" />,
  stage: <Music2 className="w-5 h-5" />,
  dance_floor: <Users2 className="w-5 h-5" />,
};

const LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  aircon: "Air Conditioning",
  av_equipment: "AV Equipment",
  catering_kitchen: "Catering Kitchen",
  bridal_suite: "Bridal Suite",
  stage: "Stage",
  dance_floor: "Dance Floor",
};

export function AmenitiesList({ amenities }: { amenities: string[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {amenities.map((key) => (
        <div
          key={key}
          className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
        >
          <span className="text-primary shrink-0">{ICONS[key] ?? <Sparkles className="w-5 h-5" />}</span>
          <span className="text-sm font-medium">{LABELS[key] ?? key}</span>
        </div>
      ))}
    </div>
  );
}
