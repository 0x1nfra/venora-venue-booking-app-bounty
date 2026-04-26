import { create } from "zustand";
import { Doc } from "@/convex/_generated/dataModel";

type FilterTab = "all" | "pending" | "approved" | "rejected";
type Booking = Doc<"bookings">;

interface AdminUIStore {
  filterTab: FilterTab;
  setFilterTab: (tab: FilterTab) => void;
  selectedBooking: Booking | null;
  setSelectedBooking: (booking: Booking | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAdminUIStore = create<AdminUIStore>((set) => ({
  filterTab: "all",
  setFilterTab: (tab) => set({ filterTab: tab }),
  selectedBooking: null,
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
