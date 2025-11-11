import { auth } from "@/firebase/config"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { SaveUser } from "./SaveUser"
import { Contact } from "@/types"

export const Login = async (router: AppRouterInstance) => {
    try {

        const provider = new GoogleAuthProvider()
        const data = await signInWithPopup(auth, provider)

        const body: Contact = {
            name: data?.user?.displayName!,
            id: data?.user?.uid,
            status: "online"
        }

        localStorage.setItem("user", JSON.stringify(body))

        //On fait appel à la fonction saveUser
        SaveUser(router, body)        

    } catch (error) {
        console.log(error)
        alert("Une erreur s'est produite")
    }
}