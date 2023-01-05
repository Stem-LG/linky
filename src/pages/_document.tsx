import { Typography } from "@mui/material";
import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
    return (
        <Html lang="en">
            <Head/>
            <body>
                <Link style={{ textDecoration: "none" }} href="/">
                    <Typography
                        variant="h1"
                        fontWeight="bold"
                        fontFamily="z003"
                        color="primary"
                        sx={{ width: "100%", textAlign: "center" }}
                    >
                        Linky
                    </Typography>
                </Link>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
