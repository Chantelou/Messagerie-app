import { Contact } from "@/types";
import { create } from "zustand";

type UserStore = {
  ListeUsers: Contact[],
  setListeUsers: (listeDB: Contact[]) => void;
}

//Store pour recupérer la liste des utilisateurs
export const useUserStore = create<UserStore>((set) => ({

  ListeUsers: [], // liste des utilisateurs

  //Ici on stock la liste complete des utilisateurs au store
  setListeUsers: (listeDB: Contact[]) => set({ ListeUsers: listeDB }),

}));


