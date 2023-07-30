import {
    Typography,
    Button,
    Box,
    Grid,
    Paper,
    Dialog,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { link, PrismaClient } from "@prisma/client";
import { getSession, useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { shortenRequestSchema, updateLinkySchema } from "../schema";
import PaperWithInfo from "../components/paperWithInfo";

export default function UserInfo({ userLinks }: any) {
    const { data: session, status } = useSession();

    const [links, setLinks] = useState(userLinks);

    switch (status) {
        case "loading":
            return (
                <>
                    <Typography color="secondary">Loading</Typography>
                </>
            );
        case "authenticated":
            return (
                <>
                    <Box textAlign="center" width="100%">
                        <PaperWithInfo
                            sx={{
                                width: { xs: "90%", sm: "70%" },
                                margin: "0 auto",
                                padding: 0,
                            }}
                        >
                            <Typography mb={5} variant="h3">
                                User Information
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                                sx={{ width: "80%", m: "2rem auto" }}
                                justifyContent="space-between"
                            >
                                <Grid item sm={12}>
                                    <Image
                                        src={
                                            session.user?.image?.toString() ||
                                            ""
                                        }
                                        alt="user image"
                                        width={120}
                                        height={120}
                                        style={{
                                            borderRadius: "25px",
                                        }}
                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="h5" fontWeight="bold">
                                        User Email
                                    </Typography>
                                    <Typography>
                                        {session.user?.email}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="h5" fontWeight="bold">
                                        User Name
                                    </Typography>
                                    <Typography>
                                        {session.user?.name}
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    {process.env.NODE_ENV == "development" ? (
                                        <>
                                            <Typography
                                                variant="h5"
                                                fontWeight="bold"
                                            >
                                                Session Expiry Date
                                            </Typography>
                                            <Typography>
                                                {session.expires}
                                            </Typography>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </Grid>
                                <Grid item sm={12}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: 20,
                                        }}
                                        onClick={() => signOut()}
                                    >
                                        logout
                                    </Button>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" color="initial" p={3}>
                                linky.louay.ga is a tool to shorten a URL or
                                reduce the length of a link for making it easy
                                to remember
                            </Typography>
                            <MyLinksTable links={links} setLinks={setLinks} />
                        </PaperWithInfo>
                    </Box>
                </>
            );
        case "unauthenticated":
            return (
                <Typography color="error" textAlign="center">
                    Access denied!
                </Typography>
            );
        default:
            return <>unknown error</>;
    }
}

interface linksTableProps {
    links: link[];
    setLinks: Function;
}

function MyLinksTable({ links, setLinks }: linksTableProps) {
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 50 },
        {
            field: "creation_date",
            headerName: "Created At",
            valueFormatter: (d) => dayjs(d.value).format("DD/MM/YYYY HH:mm"),
            width: 140,
        },
        {
            field: "visit_count",
            headerName: "visits",
            width: 55,
        },
        {
            field: "server_redirect",
            headerName: "SR",
            width: 62,
            renderCell: ({ value }) => {
                return <Checkbox checked={value} />;
            },
        },
        {
            field: "link",
            headerName: "link",
            flex: 1,
        },
        {
            field: "linky",
            headerName: "linky",
            width: 100,
        },
        {
            field: "action",
            headerName: "Actions",
            sortable: false,
            width: 200,
            renderCell: (params) => {
                const { server_redirect, id } = params.row;
                const [open, setOpen] = useState(false);

                const {
                    register,
                    handleSubmit,
                    formState: { errors },
                    setError,
                } = useForm({
                    resolver: yupResolver(updateLinkySchema),
                });

                register("id", { value: id });

                function deleteLinky() {
                    fetch("/api/deleteLinky", {
                        method: "POST",
                        body: JSON.stringify({ id }),
                    }).then((resp) => {
                        console.log("resp: ", resp);
                        switch (resp.status) {
                            case 200:
                                console.log("link deleted");
                                setLinks(links.filter((v) => id != v.id));
                                break;
                            case 404:
                                break;
                            default:
                                break;
                        }
                    });
                }

                interface updateLinkyParams {
                    link: string;
                    linky: string;
                    serverRedirect: boolean;
                }

                function updateLinky(updatedInfo: updateLinkyParams) {
                    // console.log("updatedInfo: ", updatedInfo);

                    fetch("/api/updateLinky", {
                        method: "POST",
                        body: JSON.stringify({ id, ...updatedInfo }),
                    }).then((resp) => {
                        switch (resp.status) {
                            case 200:
                                // console.log("link updated");
                                setOpen(false);
                                setLinks(
                                    links.map((link) => {
                                        if (link.id == id) {
                                            link.link = updatedInfo.link;
                                            link.linky = updatedInfo.linky;
                                            link.server_redirect = updatedInfo.serverRedirect;
                                        }

                                        return link;
                                    })
                                );
                                break;
                            case 409:
                                // console.log("link already used")
                                setError("linky", {
                                    message: "linky already used",
                                });
                            default:
                                break;
                        }
                    });
                }

                return (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Button
                                onClick={() => setOpen(true)}
                                variant="contained"
                                color="secondary"
                            >
                                Modify
                            </Button>
                            <Button
                                onClick={deleteLinky}
                                variant="outlined"
                                color="error"
                            >
                                Delete
                            </Button>
                        </Box>
                        <Dialog open={open} onClose={() => setOpen(false)}>
                            <Paper
                                sx={{
                                    width: {
                                        xs: "300px",
                                        sm: "500px",
                                        md: "600px",
                                    },
                                    height: "350px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                                component="form"
                                //@ts-ignore
                                onSubmit={handleSubmit(updateLinky)}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: "bold", mt: "20px" }}
                                    color="primary"
                                >
                                    Modify
                                </Typography>

                                <Box sx={{ width: "90%", mt: "20px" }}>
                                    {[
                                        {
                                            label: "Link",
                                            defaultValue: params.row.link,
                                            ...register("link"),
                                            error: !!errors.link,
                                            helperText:
                                                errors.link?.message?.toString(),
                                        },
                                        {
                                            label: "Linky",
                                            defaultValue: params.row.linky,
                                            ...register("linky"),
                                            error: !!errors.linky,
                                            helperText:
                                                errors.linky?.message?.toString(),
                                        },
                                    ].map((input) => (
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            sx={{ m: "10px" }}
                                            {...input}
                                        />
                                    ))}
                                    <FormControlLabel
                                        sx={{
                                            ml: "0px",
                                        }}
                                        control={
                                            <Checkbox
                                                defaultChecked={server_redirect}
                                                {...register("serverRedirect")}
                                            />
                                        }
                                        label="server redirect"
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        width: "95%",
                                        display: "flex",
                                        gap: "10px",
                                        justifyContent: "flex-end",
                                        alignItems: "flex-end",
                                        height: "100%",
                                        mb: "10px",
                                    }}
                                >
                                    <Button color="secondary" type="submit">
                                        Confirm
                                    </Button>
                                    <Button color="error">Cancel</Button>
                                </Box>
                            </Paper>
                        </Dialog>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <DataGrid
                sx={{ height: "400px", mx: "10px" }}
                columns={columns}
                rows={links}
                pageSizeOptions={[5,10,20,50,100]}
                
            />
        </>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession({ req: context.req });
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permenant: false,
            },
        };
    }
    const prisma = new PrismaClient();

    let userLinks = await prisma.link.findMany({
        where: {
            author: {
                //@ts-ignore
                equals: session.user?.email,
            },
        },
    });

    return {
        props: {
            userLinks,
        },
    };
}
