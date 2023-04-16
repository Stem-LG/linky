import { Box, Button, Fab } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MdAccountCircle, MdInfo, MdOutlineInfo } from "react-icons/md";

export default function AccountFab() {
    const { data: session } = useSession();

    return (
        <>
            <Box
                sx={{ position: "fixed", bottom: "1rem", right: "1rem", gap: 1 }}
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
            >
                <Link href={session ? "/userinfo" : "/login"}>
                    <Fab sx={{ width: "5rem", height: "5rem" }}>
                        {session ? (
                            <Image
                                src={session?.user?.image?.toString() || ""}
                                style={{ borderRadius: "50%" }}
                                alt="user image"
                                fill={true}
                                object-fit="cover"
                            />
                        ) : (
                            <MdAccountCircle size={60} />
                        )}
                    </Fab>
                </Link>
            </Box>
        </>
    );
}
