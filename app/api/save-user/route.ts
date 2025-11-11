import axios from "axios"
import { NextResponse } from "next/server"

export const PUT = async (req: Request) => {
    try {
        const body = await req.json()
        await axios.put(`${process.env.database_url}/users/${body?.id}.json`, body)

        return NextResponse.json({message: "ok" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur de connexion s'est produite."})
    }
} 