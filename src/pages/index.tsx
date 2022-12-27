import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    Button,
} from "@mui/material";
import Link from "next/link";
import { shortenRequestSchema } from "../schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface inputType {
    link: string;
    customLinky?: string;
}

export default function LinkShortner() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<inputType>({
        resolver: yupResolver(shortenRequestSchema),
    });

    const [hostname, setHostname] = useState("");

    const router = useRouter();

    useEffect(() => {
        setHostname(location.host);
    }, []);

    function onSubmit(data: inputType) {
        console.log(data);
        fetch("/api/shorten", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((resp) => resp.json())
            .then((res) => {
                router.push({ pathname: "/success", query: res });
            });
    }

    return (
        <Box textAlign="center" width="100%">
            <Paper
                sx={{
                    width: { xs: "90%", sm: "70%" },
                    margin: "auto auto",
                    padding: 2,
                }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%" }}
                >
                    <Grid
                        container
                        sx={{
                            width: "80%",
                            m: "2rem auto",
                            mb: { xs: 0, sm: "2rem" },
                        }}
                        rowSpacing={2}
                    >
                        <Grid item xs={12}>
                            <TextField
                                {...register("link")}
                                sx={{ width: "100%" }}
                                size="small"
                                variant="outlined"
                                error={Boolean(errors.link)}
                                helperText={errors.link?.message}
                                label="enter your link"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                {...register("customLinky")}
                                sx={{ width: "100%" }}
                                label="Custom url"
                                size="small"
                                error={Boolean(errors.customLinky)}
                                helperText={errors.customLinky?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {hostname + "/"}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                sx={{
                                    height: "100%",
                                    minWidth: { xs: "100%", sm: "75%" },
                                }}
                                type="submit"
                                variant="contained"
                            >
                                Shorten URL
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">OR</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Link
                                href="/info"
                                style={{ textDecoration: "none" }}
                            >
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
                    </Grid>
                </form>
                <Typography variant="body1" color="initial" sx={{ mt: 2 }}>
                    linky.louay.ga is a tool to shorten a URL or reduce the
                    length of a link for making it easy to remember
                </Typography>
            </Paper>
        </Box>
    );
}
