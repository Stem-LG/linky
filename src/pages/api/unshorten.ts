import type { NextApiRequest, NextApiResponse } from "next"
import { infoRequestSchema } from "../../schema"
import { ValidationError } from "yup"
import { PrismaClient } from "@prisma/client"




export async function getLink({ linky, increment }: { linky: string, increment: boolean }) {
    const prisma = new PrismaClient()

    let link = await prisma.link.findFirst({ where: { linky } })

    if (link) {
        if (increment) {
            await prisma.link.update({
                where: { id: link.id },
                data: {
                    visit_count: { increment: 1 }
                }
            })
        }
        return link
    } else {
        return null
    }

}


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { linky } = JSON.parse(req.body)
    try {
        await infoRequestSchema.validate({ linky })

        let link = await getLink({ linky, increment: false })
        if (link) {
            res.status(200).json({ link: link.link, serverRedirect: link.server_redirect })
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