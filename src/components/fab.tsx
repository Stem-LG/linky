import { Box, Fab } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";

export default function AccountFab() {
    const { data: session } = useSession();

    return (
        <Box
            sx={{ position: "fixed", bottom: 16, right: 16, gap: 1 }}
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
        >
            <Link href={session?"/userinfo":"/login"}>
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
                        <MdAccountCircle size={60}/>
                    )}
                </Fab>
            </Link>
        </Box>
    );
}
