import axios from "axios"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params } : { params: Promise<{ id: string }>}) => {
    try {
        const { id } = await params //On recupère l'id de l'utilisateur passé en paramettre
        const { status } = await req.json()

        await axios.patch(`${process.env.database_url}/users/${id}.json`, { status })
        
        return NextResponse.json({ message: "ok" })
    
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreure s'est. produite."})
    }
}