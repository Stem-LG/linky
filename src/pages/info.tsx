import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CustomTextField from "../components/textfield";
import { infoRequestSchema } from "../schema";
import { useState, useEffect } from "react";

interface inputType {
    linky: string;
}
export default function LinkyInfo() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<inputType>({
        resolver: yupResolver(infoRequestSchema),
    });

    const [hostname, setHostname] = useState("");
    const [link, setLink] = useState("");
    const [linkError, setLinkError] = useState("");

    useEffect(() => {
        setHostname(location.host);
    }, []);

    function onSubmit(data: inputType) {
        setLinkError("");
        fetch("/api/unshorten", {
            method: "POST",
            body: JSON.stringify(data),
        }).then((resp) => {
            const { status } = resp;
            if (status == 200) {
                resp.json().then((res) => setLink(res.link));
            } else {
                setLinkError("Link not found");
            }
        });
    }

    return (
        <>
            <Box textAlign="center" width="100%">
                <Paper sx={{ width: "70%", margin: "0 auto", padding: 1 }}>
                    <Typography mb={5} variant="h3">
                        Get linky info
                    </Typography>
                    <Grid
                        container
                        rowSpacing={2}
                        sx={{ width: "80%", m: "2rem auto" }}
                    >
                        <Grid item sm={12}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <TextField
                                    {...register("linky")}
                                    sx={{ width: "100%" }}
                                    size="small"
                                    label="Linky"
                                    error={
                                        Boolean(errors.linky) ||
                                        Boolean(linkError)
                                    }
                                    helperText={
                                        errors.linky?.message || linkError
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {hostname + "/"}
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button type="submit">
                                                    Unshorten Linky
                                                    <MdOutlineRemoveRedEye
                                                        size={18}
                                                        style={{
                                                            marginLeft: 12,
                                                        }}
                                                    />
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </form>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                link={link}
                                label="Original Link"
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="body1" color="initial">
                        linky.louay.ga is a tool to shorten a URL or reduce the
                        length of a link for making it easy to remember
                    </Typography>
                </Paper>
            </Box>
        </>
    );
}
