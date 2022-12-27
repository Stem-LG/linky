import { Box, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CustomTextField from "../components/textfield";

export default function LinkySuccessInfo() {
    const router = useRouter();
    const {query,isReady} = router
    let { link, linky } = query;


    return (
        <>
            <Box textAlign="center" width="100%">
                <Paper sx={{ width: "70%", margin: "0 auto", padding: 1 }}>
                    <Grid
                        container
                        rowSpacing={2}
                        sx={{ width: "80%", m: "2rem auto" }}
                    >
                        <Grid item sm={12}>
                            <Typography color={(link||!isReady)?"initial":"red"}>
                                {isReady?link?"Link Created Successfully 🥳":"Error!":"Loading..."}
                            </Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <CustomTextField
                                link={
                                    linky?location.host + "/" + linky:""
                                }
                                label="Linky"
                            />
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
