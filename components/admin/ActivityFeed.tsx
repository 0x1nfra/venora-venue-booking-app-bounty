"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { CalendarPlus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Booking = Doc<"bookings">;

function getActivity(booking: Booking) {
  const time = booking.statusChangedAt ?? booking._creationTime;

  if (booking.status === "approved") {
    return {
      icon: CheckCircle,
      iconClass: "text-emerald-600",
      message: `Booking approved for ${booking.guestName}`,
      time,
    };
  }
  if (booking.status === "rejected") {
    return {
      icon: XCircle,
      iconClass: "text-red-600",
      message: `Booking declined for ${booking.guestName}`,
      time,
    };
  }
  if (booking.status === "pending") {
    return {
      icon: CalendarPlus,
      iconClass: "text-amber-600",
      message: `New request from ${booking.guestName}`,
      time: booking._creationTime,
    };
  }
  return {
    icon: Clock,
    iconClass: "text-muted-foreground",
    message: `Status updated for ${booking.guestName}`,
    time,
  };
}

export function ActivityFeed({ bookings }: { bookings: Booking[] }) {
  const recent = [...bookings]
    .sort((a, b) => {
      const ta = a.statusChangedAt ?? a._creationTime;
      const tb = b.statusChangedAt ?? b._creationTime;
      return tb - ta;
    })
    .slice(0, 8);

  return (
    <Card className="border-[0.5px] h-fit">
      <CardHeader className="pb-3 pt-5 px-5">
        <h2 className="font-serif text-lg font-semibold">Activity Feed</h2>
        <p className="text-xs text-muted-foreground">Recent booking events</p>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {recent.length === 0 ? (
          <p className="px-5 pb-3 text-sm text-muted-foreground">
            No recent activity.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {recent.map((booking) => {
              const { icon: Icon, iconClass, message, time } = getActivity(
                booking
              );
              return (
                <li key={booking._id} className="flex items-start gap-3 px-5 py-3">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconClass}`} />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">{message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(time), { addSuffix: true })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
