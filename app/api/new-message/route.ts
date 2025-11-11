import axios from "axios"
import { NextResponse } from "next/server"
import { SendNotification } from "../send-push-notifications/SendPush"

export const POST = async (req: Request) => {
    try {
        const body = await req.json()

        //On envoi le message
        await axios.post(`${process.env.database_url}/discutions.json`, body)

       //On envoi une notifications push au receveur

        //On recupère le token du recever depuis la db
        const getUsertoken = await axios.get(`${process.env.database_url}/push-tokens/${body?.recever}.json`)

        //Optionielle
        if (!getUsertoken?.data?.token) {
            return NextResponse.json({ message: "Token du destinataire manquant" })
        }

        const userToken = getUsertoken?.data?.token //on copie le token du receveur pour les push

        const push = await SendNotification(userToken, "Nouveau message", body?.text )

        console.log("PUSH RESPONSE: ", push)
        return NextResponse.json({message: "ok" })


    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Une erreur de connexion s'est produite." })
    }
} 