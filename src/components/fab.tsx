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
                sx={{ position: "fixed", bottom: {xs:"52.5px",sm:"16px"}, right: "16px", gap: 1 }}
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems="center"
            >
                <Link href={session ? "/userinfo" : "/login"}>
                    <Fab sx={{ width: 100, height: 100 }}>
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
