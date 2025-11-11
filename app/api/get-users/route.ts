import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
    try {
        
         const data = await axios.get(`${process.env.database_url}/users.json`)

        const users = Object.values(data?.data); //On convertie en tableau js les resultats

         return NextResponse.json({ users })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite"})
    }
}