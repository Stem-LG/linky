import type { NextApiRequest, NextApiResponse } from "next"
import randomString from "../../tools/random"
import { shortenRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { link, customLinky } = JSON.parse(req.body)


    try {
        await shortenRequestSchema.validate({ link, customLinky })
        console.log("customLinky: ",customLinky)
        const prisma = new PrismaClient()


        if (Boolean(customLinky)) {
            if (Boolean(await prisma.link.findFirst({ where: { linky: customLinky } }))) {
                res.status(409).json({ error: "linky already used" })
            } else {
                await prisma.link.create({ data: { link, linky: customLinky } })
                res.status(200).json({ link, customLinky })
            }
        } else {
            let i = 0
            let linky = randomString()
            while (i < 5 && Boolean(await prisma.link.findFirst({ where: { linky } }))) {
                linky = randomString()
                i++
            }

            if (i == 5) {
                res.status(508).json({ error: "can't set a random linky,try again or choose a customLinky" })
            } else {
                await prisma.link.create({ data: { link, linky } })
                res.status(200).json({ link, customLinky: linky })
            }
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({
                error: err.message
            })
        } else {
            res.status(500).json({ error: "unknown server error" })
        }
    }
}