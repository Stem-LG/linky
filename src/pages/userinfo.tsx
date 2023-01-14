import { Typography, Button, Box, Grid, Paper } from "@mui/material";
import { getSession, useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";

export default function UserInfo() {
    const { data: session, status } = useSession();

    switch (status) {
        case "loading":
            return (
                <>
                    <Typography color="secondary">Loading</Typography>
                </>
            )
        case "authenticated":
            return (
                <>
                    <Box textAlign="center" width="100%">
                        <Paper
                            sx={{
                                width: { xs: "90%", sm: "70%" },
                                margin: "0 auto",
                                padding: 0,
                            }}
                        >
                            <Typography mb={5} variant="h3">
                                User Information
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                                sx={{ width: "80%", m: "2rem auto" }}
                                justifyContent="space-between"
                            >
                                <Grid item sm={12}>
                                    <Image
                                        src={
                                            session.user?.image?.toString() ||
                                            ""
                                        }
                                        alt="user image"
                                        width={120}
                                        height={120}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="h5" fontWeight="bold">
                                        User Email
                                    </Typography>
                                    <Typography>
                                        {session.user?.email}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="h5" fontWeight="bold">
                                        User Name
                                    </Typography>
                                    <Typography>
                                        {session.user?.name}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    {process.env.NODE_ENV == "development" ? (
                                        <>
                                            <Typography
                                                variant="h5"
                                                fontWeight="bold"
                                            >
                                                Session Expiry Date
                                            </Typography>
                                            <Typography>
                                                {session.expires}
                                            </Typography>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                <Grid item sm={12}>
                                    <Button variant="contained" color="error" size="large" sx={{fontWeight:"bold", fontSize:20}} onClick={() => signOut()}>
                                        logout
                                    </Button>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" color="initial" p={3}>
                                linky.louay.ga is a tool to shorten a URL or
                                reduce the length of a link for making it easy
                                to remember
                            </Typography>
                        </Paper>
                    </Box>
                </>
            );
        case "unauthenticated":
            return (
                <Typography color="error" textAlign="center">
                    Access denied!
                </Typography>
            )
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
        props: {},
    };
}
