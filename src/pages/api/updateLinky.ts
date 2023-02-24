import type { NextApiRequest, NextApiResponse } from "next"
import { updateLinkySchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("api body: ", req.body)


    const { id, link, linky } = JSON.parse(req.body)





    const session = await getServerSession(req, res, authOptions)
    try {
        await updateLinkySchema.validate({ id, link, linky })

        const prisma = new PrismaClient()

        const ogLink = await prisma.link.findFirst({ where: { id } })

        if (ogLink) {
            if (ogLink.author == session?.user.email) {
                await prisma.link.update(
                    {
                        where: {
                            id
                        },
                        data: {
                            link, linky
                        }
                    }
                )
                res.status(200).json({ id })
            } else {
                res.status(401).json({ error: "unauthorized" })
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