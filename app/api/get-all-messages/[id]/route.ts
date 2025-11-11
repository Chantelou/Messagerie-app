import { Message } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params} : { params: Promise<{ id: string}>}) => {
    try {
        const { id } = await params

         const data = await axios.get(`${process.env.database_url}/discutions.json`)

        if(!data?.data) {
            return NextResponse.json({message: "Aucun message trouvé"})
        }

        const listeComplete: Message[] = Object.values(data?.data); //On convertie en tableau js les resultats

        //On filtre les messages par utilisateur (soit il est le sender ou le recever)
        const filtre = listeComplete.filter(item => item.sender === id || item.recever === id)

         return NextResponse.json({ discutions: filtre })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Erreur"})
    }
}