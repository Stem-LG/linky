import { Button, Typography } from "@mui/material";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

export default function LoginPage() {
    const { data: session } = useSession();

    return session ? (
        <>
            <Typography>logged in</Typography>
            <Button onClick={() => signOut()}>logout</Button>
        </>
    ) : (
        <>
            <Typography>not logged in</Typography>
            <Button onClick={() => signIn()}>login</Button>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession({ req: context.req });
    if (session) {
        return {
            redirect: {
                destination: "/userinfo",
                permenant: false,
            },
        };
    }
    return {
        props: {}
    };
}
