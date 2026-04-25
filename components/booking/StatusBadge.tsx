import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string; glow?: string }
> = {
  pending: {
    label: "Pending Review",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    glow: "0 0 8px rgba(245,158,11,0.35)",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    glow: "0 0 8px rgba(5,150,105,0.3)",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
    glow: "0 0 8px rgba(239,68,68,0.3)",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", config.className)}
      style={config.glow ? { boxShadow: config.glow } : undefined}
    >
      {config.label}
    </Badge>
  );
}
