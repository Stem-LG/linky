import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaperWithInfo from "../components/paperWithInfo";
import { infoRequestSchema } from "../schema";
import { getLink } from "./api/unshorten";

export default function Redirect(props: any) {
    let { link } = props;

    const [exists, setExists] = useState(true);

    useEffect(() => {
        if (!link) {
            setExists(false);
        } else {
            setTimeout(() => {
                // window.open(link, "_self");
            }, 3000);
        }
    }, [link]);

    return (
        <PaperWithInfo sx={{width:"calc(100% - 60px)",padding:"20px"}}>
            {exists ? (
            <Typography sx={{ textAlign: "center" }}>
                Redirecting in 3 seconds...
                <br />
                <Link href={link || "#"}>click this if not</Link>
            </Typography>
            ) : (
            <>
                <Typography sx={{ textAlign: "center" }} variant="h3">
                    404 Linky isn't registered
                </Typography>
            </>
            )}
            <AdSection/>
        </PaperWithInfo>
    );
}

function AdSection(){

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection:"column",
                justifyContent: "center",
                alignItems: "center",
                width: "350px",
                height: "300px",
                mx: "auto",
                mt: "50px",
                bgcolor: "#1976d255",
                fontSize:"48px"
            }}
        >
            Put your ad here<br/><a style={{textDecoration:"none",color:"red"}} href="mailto:louayghanney71@outlook.com">email</a>
        </Box>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {
        query: { linky },
    } = context;

    try {
        await infoRequestSchema.validate({ linky });

        //@ts-ignore
        const link = await getLink({ linky, increment: true });

        return link?.server_redirect
            ? {
                  redirect: {
                      permanent: true,
                      destination: link.link,
                  },
              }
            : {
                  props: { link: link?.link },
              };
    } catch (e) {
        return {
            props: { link: null },
        };
    }
};
