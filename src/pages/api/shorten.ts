import type { NextApiRequest, NextApiResponse } from "next"
import randomString from "../../tools/random"
import { shortenRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import {PrismaClient} from "@prisma/client"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { link, customLinky } = JSON.parse(req.body)
    try{
        await shortenRequestSchema.validate({ link, customLinky })
        const linky = customLinky || randomString()

        const prisma = new PrismaClient()

        await prisma.link.create({data:{link,linky}})



        res.status(200).json({ link,linky })
    
    }catch(err){
        if (err instanceof ValidationError) {
            res.status(400).json({
                error: err.message
            })
        }
    }
}