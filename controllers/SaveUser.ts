import { Contact } from "@/types";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const SaveUser = async (router: AppRouterInstance, body: Contact) => {
    try {

        //On ajoute une sessionStore pour verifie l'expiration des données
        sessionStorage.setItem("loginTimeOut", 'online')

        //On save l'utilisateur dans la db
        const req = await axios.put("/api/save-user", body)

        if (req?.data?.message !== "ok") {
            return alert(req?.data?.message)
        }

        //On redirige vers la page de chat
        return router.push("/chat")

    } catch (error) {
        
    }
}