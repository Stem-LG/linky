import NextAuth, { DefaultSession,User } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            
            role: string
        } & DefaultSession["user"]
    }
    
    interface User {
        role: string
        & User
    } 
}

