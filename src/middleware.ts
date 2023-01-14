import { withAuth } from "next-auth/middleware"



export default withAuth({
    callbacks:{
        authorized({token}) {
            return Boolean(token)
        },
    }
})


// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/api/shorten", "/api/userinfo","/","/success","/userinfo"],
}