// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  console.log("login info: ", session?.user || "not logged")
  res.status(200).json({
    loginStatus: !!session?.user,
    message: (session?.user) ? { name: session.user.name, email: session.user.email } : ""
  })
}
