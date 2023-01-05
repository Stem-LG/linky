import { Typography, Button } from "@mui/material";
import { getSession, useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function UserInfo() {
    const { data: session, status } = useSession();

    switch (status) {
        case "loading":
            return (
                <>
                    <Typography color="secondary">Loading</Typography>
                </>
            );
        case "authenticated":
            return (
                <>
                    <Typography>logged in</Typography>
                    <Button onClick={() => signOut()}>logout</Button>
                    <Typography>user email: {session.user?.email}</Typography>
                    <Typography>user name: {session.user?.name}</Typography>
                    <Image
                        src={session.user?.image?.toString() || ""}
                        alt="user image"
                        width={120}
                        height={120}
                    />
                    <Typography>expires: {session.expires}</Typography>
                </>
            );
        case "unauthenticated":
            return (
                <Typography color="error" textAlign="center">
                    Access denied!
                </Typography>
            );
        default:
            return <>unknown error</>

    }
}

export async function getServerSideProps(context: any) {
    const session = await getSession({ req: context.req });
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permenant: false,
            },
        };
    }
    return {
        props:{}
    };
}
