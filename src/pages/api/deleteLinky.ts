import type { NextApiRequest, NextApiResponse } from "next"
import { deleteRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("api body: ", req.body)


    const { id } = JSON.parse(req.body)



    const session = await getServerSession(req, res, authOptions)
    try {
        await deleteRequestSchema.validate({ id })

        const prisma = new PrismaClient()

        const link = await prisma.link.findFirst({ where: { id } })

        if (link) {
            if (link.author == session?.user.email) {
                await prisma.link.delete(
                    {
                        where: {
                            id
                        }
                    }
                )
                res.status(200).json({ id })
            }else{
                res.status(401).json({error: "unauthorized"})
            }
        }
        else
            res.status(404).json({ error: "Link not found" })

    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({
                error: err.message
            })
        }
    }
}