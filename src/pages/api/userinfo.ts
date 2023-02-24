// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  res.status(200).json({
    loginStatus: !!session?.user,
    message: (session?.user) ? { name: session.user.name, email: session.user.email, role:session.user.role } : ""
  })
}
