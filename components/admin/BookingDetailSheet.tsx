"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/booking/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle, XCircle, CalendarDays, Users, Mail, Phone, FileText } from "lucide-react";
import { format } from "date-fns";

type Booking = Doc<"bookings">;

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Wedding",
  conference: "Conference",
  birthday: "Birthday",
  corporate: "Corporate",
  other: "Other",
};

interface BookingDetailSheetProps {
  booking: Booking | null;
  onClose: () => void;
}

export function BookingDetailSheet({ booking, onClose }: BookingDetailSheetProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [internalNotes, setInternalNotes] = useState(booking?.adminNotes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const updateStatus = useMutation(api.bookings.updateStatus);
  const updateNotes = useMutation(api.bookings.updateNotes);

  useEffect(() => {
    setInternalNotes(booking?.adminNotes ?? "");
  }, [booking?._id, booking?.adminNotes]);

  async function handleSaveNotes() {
    if (!booking) return;
    setNotesSaving(true);
    try {
      await updateNotes({ bookingId: booking._id, notes: internalNotes });
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes.");
    } finally {
      setNotesSaving(false);
    }
  }

  async function handleAction(status: "approved" | "rejected") {
    if (!booking) return;
    setIsPending(true);
    try {
      await updateStatus({
        bookingId: booking._id,
        status,
        adminNotes: adminNotes.trim() || undefined,
      });
      toast.success(status === "approved" ? "Booking approved." : "Booking rejected.");
      onClose();
    } catch {
      toast.error("Failed to update status. Try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Sheet open={!!booking} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto px-6 pb-6">
        {booking && (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">{booking.guestName}</SheetTitle>
                <StatusBadge status={booking.status} />
              </div>
              <SheetDescription>
                Submitted {format(new Date(booking._creationTime), "dd MMM yyyy, HH:mm")}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {booking.eventDate}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Event Type</p>
                  <p className="text-sm font-medium">
                    {EVENT_TYPE_LABELS[booking.eventType] ?? booking.eventType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Guests</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {booking.guestCount}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Booking ID</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{booking._id}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{booking.guestEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{booking.guestPhone}</span>
                </div>
              </div>

              {booking.notes && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Guest Notes</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.notes}</p>
                  </div>
                </>
              )}

              <Separator />
              <div className="space-y-2">
                <Label htmlFor="internalNotes" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Internal Notes (admin only)
                </Label>
                <Textarea
                  id="internalNotes"
                  placeholder="Add private notes about this booking..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={notesSaving || internalNotes === (booking.adminNotes ?? "")}
                  className="w-full"
                >
                  {notesSaving ? "Saving…" : "Save Notes"}
                </Button>
              </div>

              {booking.status === "pending" && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="adminNotes" className="text-xs uppercase tracking-wide text-muted-foreground">
                        Admin Notes (optional)
                      </Label>
                      <Textarea
                        id="adminNotes"
                        placeholder="Reason for approval or rejection..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAction("approved")}
                        disabled={isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleAction("rejected")}
                        disabled={isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
