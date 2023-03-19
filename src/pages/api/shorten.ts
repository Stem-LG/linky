import type { NextApiRequest, NextApiResponse } from "next"
import randomString from "../../tools/random"
import { shortenRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { link, customLinky, serverRedirect } = JSON.parse(req.body)
    const session = await getServerSession(req, res, authOptions)
    try {
        await shortenRequestSchema.validate({ link, customLinky, serverRedirect })
        const prisma = new PrismaClient()
        if (Boolean(customLinky)) {
            if (Boolean(await prisma.link.findFirst({ where: { linky: customLinky } }))) {
                res.status(409).json({ error: "linky already used" })
            } else if (session?.user.email) {
                await prisma.link.create({ data: { link, linky: customLinky, author: session.user.email, "server_redirect": serverRedirect } })
                res.status(200).json({ link, customLinky })
            } else {
                res.status(409).json({ error: "user not authenticated. this shouldn't happen, but if it did i have protection :)" })
            }
        } else {
            let i = 0
            let linky = randomString()
            while (i < 5 && Boolean(await prisma.link.findFirst({ where: { linky } }))) {
                linky = randomString()
                i++
            }

            if (i == 5) {
                res.status(508).json({ error: "can't set a random linky,try again or choose an unused customLinky" })
            } else if (session?.user.email) {
                await prisma.link.create({ data: { link, linky, author: session.user.email } })
                res.status(200).json({ link, customLinky: linky })
            } else {
                res.status(409).json({ error: "user not authenticated. this shouldn't happen, but if it did i have protection :)" })
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