import { auth } from "@/firebase/config"
import axios from "axios"
import { signOut } from "firebase/auth"

export const Logout = async () => {
    try {

        if (typeof window !== undefined) {

            const id = JSON.parse(localStorage.getItem("user")!)?.id || null

            //On met le status en offline dans la db
            const req = await axios.patch(`/api/update-status/${id}`, { status: "offline" })

            if (req?.data?.message === "ok") {
                await signOut(auth) //On deconnecte l'utilisateur de firebase
                localStorage.removeItem("user") //On supprime les infos de l'utilisateurs en local
                return location.href = "/"
            }

            alert("Utilisateur non déconnecté.")
        }

    } catch (error) {
        console.log(error)
    }
}