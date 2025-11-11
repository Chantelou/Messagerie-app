import axios from "axios"
import { ToastError, ToastSucces } from "./ToastMessage"

export const SaveTokenPush = async (token: string) => {
    try {
        if(typeof window !== undefined) {
            const idUser = JSON.parse(localStorage.getItem("user")!)?.id || null
            const req = await axios.put("/api/save-token-push", { idUser, token })
            if(req?.data?.message === "ok") {
                return; //ToastSucces("Merci d'avoir accepter de recevoir nos notifications.")
            }

            return ToastError("Une erreur s'est produite pendant votre souscription aux notifications.")
        }
    } catch (error) {
        console.log(error)
    }
}