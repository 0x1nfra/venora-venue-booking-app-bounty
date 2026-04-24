import { create } from "zustand";

type FilterTab = "all" | "pending" | "approved" | "rejected";

interface AdminUIStore {
  filterTab: FilterTab;
  setFilterTab: (tab: FilterTab) => void;
}

export const useAdminUIStore = create<AdminUIStore>((set) => ({
  filterTab: "all",
  setFilterTab: (tab) => set({ filterTab: tab }),
}));
