import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import { signIn, getProviders, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    FaDiscord,
    FaFacebook,
    FaGithub,
    FaGoogle,
    FaKey,
} from "react-icons/fa";

//@ts-ignore
export default function SignIn({ providers }) {
    const router = useRouter();
    return (
        <>
            <Box textAlign="center" width="100%">
                <Paper
                    sx={{
                        width: { xs: "90%", sm: "70%" },
                        margin: "0 auto",
                        padding: 0,
                    }}
                    elevation={12}
                >
                    <Typography mb={5} variant="h3">
                        Welcome
                        <br />
                        Please Login
                    </Typography>
                    {router.query.error == "OAuthAccountNotLinked" ? (
                        <Typography color="error">
                            Login with the same account you originally used
                        </Typography>
                    ) : router.query.error ? (
                        "an error occured, try again"
                    ) : (
                        ""
                    )}
                    <Grid
                        container
                        spacing={2}
                        sx={{ width: "80%", m: "2rem auto" }}
                        justifyContent="space-between"
                    >
                        <Grid item sm={12}>
                            <ButtonGroup
                                orientation="vertical"
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: "50%",
                                        lg: "35%",
                                    },
                                }}
                                variant="outlined"
                            >
                                {Object.values(providers).map(
                                    (provider: any, index) => (
                                        <LoginButton
                                            key={index}
                                            providerId={provider.id}
                                            providerName={provider.name}
                                        />
                                    )
                                )}
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">OR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Link href="/info" style={{ textDecoration: "none" }}>
                            <Button
                                sx={{
                                    minWidth: {
                                        xs: "100%",
                                        sm: "50%",
                                        lg: "35%",
                                    },
                                }}
                                variant="contained"
                            >
                                Get Linky Info
                            </Button>
                        </Link>
                    </Grid>
                    <Typography variant="body1" color="initial" p={3}>
                        linky.louay.ga is a tool to shorten a URL or reduce the
                        length of a link for making it easy to remember
                    </Typography>
                </Paper>
            </Box>
        </>
    );
}

interface LoginButtonProps {
    providerName: string;
    providerId: string;
}

function LoginButton({ providerName, providerId }: LoginButtonProps) {
    const icon =
        providerName == "Facebook" ? (
            <FaFacebook />
        ) : providerName == "Google" ? (
            <FaGoogle />
        ) : providerName == "Discord" ? (
            <FaDiscord />
        ) : (
            <FaKey />
        );
    const color =
        providerName == "Facebook"
            ? "blue"
            : providerName == "Google"
            ? "red"
            : providerName == "Discord"
            ? "purple"
            : "primary";

    return (
        <Button
            startIcon={icon}
            onClick={() => signIn(providerId)}
            sx={{
                minHeight: 50,
                color,
                borderColor: color,
                "&:hover": {
                    borderColor: color,
                },
            }}
        >
            login with {providerName}
        </Button>
    );
}
export async function getServerSideProps(context: any) {
    const session = await getSession({ req: context.req });
    if (session) {
        return {
            redirect: {
                destination: context.query.callbackUrl || "/",
                permenant: false,
            },
        };
    }
    return {
        props: { providers: await getProviders() },
    };
}
