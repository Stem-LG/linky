import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";
import { Session } from "inspector";


export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    session: {
        strategy: "jwt",

    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || ""
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_ID || "",
            clientSecret: process.env.DISCORD_SECRET || ""
        })
        // ...add more providers here
    ],

    adapter: PrismaAdapter(prisma),
    callbacks: {
        async jwt({ token, user }) {
            if (user?.role) {
                token.role = user.role; // Add role value to user object so it is passed along with session
            }
            return token
        }
    },
    pages:{
        signIn:"/login",
    }
}


export default NextAuth(authOptions);
