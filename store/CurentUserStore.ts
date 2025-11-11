import { Contact } from "@/types";
import { create } from "zustand";

type CurentUserStoreType = {
    currentUser: Contact | null,
    setCurrentUser: (user: Contact) => void
}
//Store pour afficher l'utilisateur avec qui on discute
export const CurentUserStore = create<CurentUserStoreType>((set) => ({
    currentUser: null,
    setCurrentUser: (user: Contact) => set({ currentUser: user }),
}))
