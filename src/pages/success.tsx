import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import CustomTextField from "../components/textfield";
import { MdOpenInNew, MdContentCopy } from "react-icons/md";

export default function LinkySuccessInfo() {
    const router = useRouter();
    const { query, isReady } = router;
    let { link, linky } = query;

    return (
        <>
            <Box textAlign="center" width="100%">
                <Paper sx={{ width: { xs: "90%", sm: "70%" }, margin: "0 auto", padding: 1 }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ width: "80%", m: "2rem auto" }}
                    >
                        <Grid item xs={12}>
                            <Typography
                                color={link || !isReady ? "initial" : "red"}
                            >
                                {isReady
                                    ? link
                                        ? "Link Created Successfully 🥳"
                                        : "Error!"
                                    : "Loading..."}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                link={linky ? location.host + "/" + linky : ""}
                                label="Linky"
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
                            xs={6}
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
                                    if (linky)
                                        window.open(
                                            "http://" +
                                                location.host +
                                                "/" +
                                                linky.toString(),
                                            "_blank"
                                        );
                                }}
                            >   
                            Open
                                <MdOpenInNew
                                    size={20}
                                    style={{ marginLeft: "5px" }}
                                />
                            </Button>
                        </Grid>
                        <Grid
                            item
                            xs={6}
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
                                    if (linky)
                                        navigator.clipboard.writeText(
                                            location.host +
                                                "/" +
                                                linky.toString()
                                        );
                                }}
                            >
                                Copy
                                <MdContentCopy
                                    size={20}
                                    style={{ marginLeft: "5px" }}
                                />
                            </Button>
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
