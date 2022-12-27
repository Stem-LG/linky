import type { NextApiRequest, NextApiResponse } from "next"
import { infoRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { linky } = JSON.parse(req.body)
    try {
        await infoRequestSchema.validate({ linky })

        const prisma = new PrismaClient()

        const link = await prisma.link.findFirst({where: {linky} })
        
        if(link)
        res.status(200).json({ link: link.link })
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