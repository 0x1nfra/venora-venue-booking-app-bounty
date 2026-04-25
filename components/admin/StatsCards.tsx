import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CalendarDays, TrendingUp } from "lucide-react";

type Booking = Doc<"bookings">;

function computeStats(bookings: Booking[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const thisWeek = bookings.filter((b) => b._creationTime >= weekAgo).length;
  const approved = bookings.filter((b) => b.status === "approved").length;
  const rejected = bookings.filter((b) => b.status === "rejected").length;
  const reviewed = approved + rejected;
  const approvalRate = reviewed > 0 ? Math.round((approved / reviewed) * 100) : 0;
  return { pending, thisWeek, approvalRate };
}

export function StatsCards({ bookings }: { bookings: Booking[] }) {
  const { pending, thisWeek, approvalRate } = computeStats(bookings);

  const stats = [
    {
      label: "Total Pending",
      value: pending,
      description: "Awaiting review",
      icon: Clock,
    },
    {
      label: "This Week",
      value: thisWeek,
      description: "New requests",
      icon: CalendarDays,
    },
    {
      label: "Approval Rate",
      value: `${approvalRate}%`,
      description: "Of reviewed bookings",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, description, icon: Icon }) => (
        <Card key={label} className="border-[0.5px]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {label}
                </p>
                <p className="text-3xl font-semibold tracking-tight">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
