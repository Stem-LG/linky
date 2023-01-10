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
import { MdOpenInNew, MdContentCopy } from "react-icons/md";
import ButtonWithLoading from "../components/buttonWithLoading";

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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setHostname(location.host);
    }, []);

    function onSubmit(data: inputType) {
        setLoading(true);
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
            setTimeout(() => {
                setLoading(false);
            }, 500);
        });
        
    }

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
                        Get linky info
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ width: "80%", m: "2rem auto" }}
                            justifyContent="space-between"
                        >
                            <Grid item sm={12} sx={{ width: "100%" }}>
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
                                            <InputAdornment
                                                position="end"
                                                sx={{
                                                    display: {
                                                        xs: "none",
                                                        md: "flex",
                                                    },
                                                }}
                                            >
                                                <ButtonWithLoading
                                                    loadingState={loading}
                                                    type="submit"
                                                >
                                                    Unshorten Linky
                                                    <MdOutlineRemoveRedEye
                                                        size={18}
                                                        style={{
                                                            marginLeft: 12,
                                                        }}
                                                    />
                                                </ButtonWithLoading>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextField
                                    link={link}
                                    label="Original Link"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6.5}
                                sx={{
                                    display: {
                                        xs: "flex",
                                        md: "none",
                                    },
                                }}
                            >
                                <Button
                                    sx={{ width: "100%" }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Unshorten
                                    <MdOutlineRemoveRedEye
                                        size={18}
                                        style={{
                                            marginLeft: 12,
                                        }}
                                    />
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sm={2.5}
                                sx={{
                                    display: {
                                        xs: "flex",
                                        md: "none",
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ height: "100%", width: "100%" }}
                                    onClick={() => {
                                        if (link)
                                            window.open(
                                                link.toString(),
                                                "_blank"
                                            );
                                    }}
                                >
                                    <MdOpenInNew size={20} />
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                sm={2.5}
                                sx={{
                                    display: {
                                        xs: "flex",
                                        md: "none",
                                    },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{ height: "100%", width: "100%" }}
                                    onClick={() => {
                                        if (link)
                                            navigator.clipboard.writeText(
                                                link.toString()
                                            );
                                    }}
                                >
                                    <MdContentCopy size={20} />
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Typography variant="body1" color="initial" p={3}>
                        linky.louay.ga is a tool to shorten a URL or reduce the
                        length of a link for making it easy to remember
                    </Typography>
                </Paper>
            </Box>
        </>
    );
}
