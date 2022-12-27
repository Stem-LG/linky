import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Redirect() {
    const router = useRouter();
    const { linky } = router.query;
    const [exists, setExists] = useState(true);

    useEffect(() => {
        if (!linky) {
            return;
        } else {
            fetch("/api/unshorten", {
                method: "POST",
                body: JSON.stringify({ linky }),
            }).then((resp) => {
                const { status } = resp;
                if (status == 200) {
                    resp.json().then((res) => window.open(res.link, "_self"));
                } else {
                    setExists(false);
                }
            });
        }
    }, [linky]);

    return exists ? (
        <Typography sx={{ textAlign: "center" }}>
            you'll be redirected soon to your destination
        </Typography>
    ) : (
        <>
            <Typography sx={{ textAlign: "center" }} variant="h3">
                404 Linky isn't registered
            </Typography>
        </>
    );
}
