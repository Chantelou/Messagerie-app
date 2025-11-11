import { onAuthStateChanged } from "firebase/auth";
import { SaveUser } from "./SaveUser";
import { auth } from "@/firebase/config";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

export const LoginMidleware = (
    router: AppRouterInstance, 
    setLoading: Dispatch<SetStateAction<boolean>>, 
    page: string
) => {

    // ✅ Vérifie qu'on est bien dans le navigateur (et pas côté serveur Next.js)
    if (typeof window !== "undefined") {

        // ✅ Récupération du user depuis le localStorage (avec gestion d'erreur)
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) {
            //Si on se trouve sur la page d'accueil (login), on affiche le bouton de connexion
            if (page === "accueil") {
                setLoading(false);
            } else { //Ici on est sur la page chat, on redirige l'utilisateur sur la page d'accueil (login)
                router.push("/")
            }
            return; // ⛔ stoppe ici si aucun utilisateur local
        }

        // ✅ Vérifie l'état de connexion avec Firebase
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {

                //Si on se trouve sur la page d'accueil (login), on affiche le bouton de connexion
                if (page === "accueil") {
                    setLoading(false);
                } else { //Ici on est sur la page chat, on redirige l'utilisateur sur la page d'accueil (login)
                    router.push("/")
                }
                return;
            }

            // ✅ Redirige et met à jour le statut
            if (page === "accueil") {
                SaveUser(router, user);
            } else {
                setLoading(false)
            }

        });

        // ✅ Nettoyage de l'écouteur quand le composant se démonte
        return () => unsubscribe();
    }

}