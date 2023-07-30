import {
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Slider,
    TextField,
    InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import CustomTextField from "../components/textfield";
import { MdOpenInNew, MdContentCopy } from "react-icons/md";
import PaperWithInfo from "../components/paperWithInfo";
import { QRCode, IProps as qrCodeProps } from "react-qrcode-logo";
import { useEffect, useState } from "react";

export default function LinkySuccessInfo() {
    const router = useRouter();
    const { query, isReady } = router;
    let { link, customLinky } = query;

    const [fullLinky, setFullLinky] = useState("");

    const [qrCodeOptions, setQrCodeOptions] = useState<qrCodeProps>({
        ecLevel: "M",
        logoImage: "",
        quietZone: 64,
        logoPadding: 10,
        qrStyle: "squares",
        logoWidth: 256,
        eyeColor: "",
        fgColor: "#000000",
        bgColor: "#ffffff",
    });

    function copyQrCode2Clipboard() {
        const canvas = document.getElementById(
            "react-qrcode-logo"
        ) as HTMLCanvasElement;

        canvas.toBlob((blob) => {
            if (blob)
                navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ]);
        });
    }

    function saveQrCode2PNG() {
        const canvas = document.getElementById(
            "react-qrcode-logo"
        ) as HTMLCanvasElement;

        canvas.toBlob((blob) => {
            if (blob) {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "qrcode.png";
                a.click();
                a.remove();
            }
        });
    }
    
    function setQrErrorCorrectionLevel(e: SelectChangeEvent<string>) {
        const value = e.target.value as "L" | "M" | "Q" | "H";
        setQrCodeOptions({
            ...qrCodeOptions,
            ecLevel: value,
        });
    }

    function setQrStyle(e: SelectChangeEvent<string>) {
        const value = e.target.value as "squares" | "dots";
        setQrCodeOptions({
            ...qrCodeOptions,
            qrStyle: value,
        });
    }

    function setQrEyeRadius(e: Event, value: number | number[]) {
        setQrCodeOptions({
            ...qrCodeOptions,
            eyeRadius: Number(value),
        });
    }

    function setQrLogoSize(e: Event, value: number | number[]) {
        setQrCodeOptions({
            ...qrCodeOptions,
            logoWidth: Number(value),
        });
    }

    function hexColorValid(color: string): boolean {
        return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{8})$/.test(
            color
        );
    }

    function setQrEyeColor(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length == 0) {
            setQrCodeOptions({
                ...qrCodeOptions,
                eyeColor: "",
            });
        } else if (
            !hexColorValid("ff" + e.target.value[e.target.value.length - 1])
        ) {
            e.target.value = e.target.value.slice(0, -1);
        } else if (hexColorValid(e.target.value)) {
            setQrCodeOptions({
                ...qrCodeOptions,
                eyeColor: `#${e.target.value}`,
            });
        }
    }

    function setQrFgColor(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length == 0) {
            setQrCodeOptions({
                ...qrCodeOptions,
                fgColor: `#000000`,
            });
        } else if (
            !hexColorValid("ff" + e.target.value[e.target.value.length - 1])
        ) {
            e.target.value = e.target.value.slice(0, -1);
        } else if (hexColorValid(e.target.value)) {
            setQrCodeOptions({
                ...qrCodeOptions,
                fgColor: `#${e.target.value}`,
            });
        }
    }

    function setQrBgColor(e: React.ChangeEvent<HTMLInputElement>) {
        //check if color is valid hex color also supports transparency
        if (e.target.value.length == 0) {
            setQrCodeOptions({
                ...qrCodeOptions,
                bgColor: `#fff0`,
            });
        } else if (
            !hexColorValid("ff" + e.target.value[e.target.value.length - 1])
        ) {
            e.target.value = e.target.value.slice(0, -1);
        } else if (hexColorValid(e.target.value)) {
            setQrCodeOptions({
                ...qrCodeOptions,
                bgColor: `#${e.target.value}`,
            });
        }
    }

    function setQrImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setQrCodeOptions({
                    ...qrCodeOptions,
                    logoImage: reader.result?.toString(),
                });
            };
        }
    }

    useEffect(() => {
        if (customLinky) {
            setFullLinky(
                    location.host +
                    "/" +
                    customLinky.toString()
            );
            setQrCodeOptions({
                ...qrCodeOptions,
                value: fullLinky,
            });
        }
    });

    return (
        <Box textAlign="center" width="100%">
            <PaperWithInfo
                sx={{
                    width: { xs: "90%", md: "70%" },
                    margin: "0 auto",
                    padding: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        width: "80%",
                        m: "2rem auto",
                    }}
                >
                    <Typography color={link || !isReady ? "initial" : "error"}>
                        {isReady
                            ? link
                                ? "Link Created Successfully 🥳"
                                : "Missing information!"
                            : "Loading..."}
                    </Typography>

                    <CustomTextField link={fullLinky} label="Linky" />

                    <CustomTextField link={link} label="Original Link" />

                    <Button
                        variant="contained"
                        sx={{
                            height: "100%",
                            width: "100%",
                            display: { md: "none" },
                        }}
                        onClick={() => {
                            window.open(fullLinky, "_blank");
                        }}
                    >
                        Open
                        <MdOpenInNew size={20} style={{ marginLeft: "5px" }} />
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            height: "100%",
                            width: "100%",
                            display: { md: "none" },
                        }}
                        onClick={() => {
                            if (customLinky)
                                navigator.clipboard.writeText(fullLinky);
                        }}
                    >
                        Copy
                        <MdContentCopy
                            size={20}
                            style={{ marginLeft: "5px" }}
                        />
                    </Button>

                    <Box
                        sx={{
                            display: "flex",
                            mt: "1rem",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <Box>
                            {/* qr code */}
                            <Box
                                sx={{
                                    "& #react-qrcode-logo": {
                                        height: "10rem !important",
                                        width: "10rem !important",
                                    },
                                }}
                            >
                                <QRCode size={1024} {...qrCodeOptions} />
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={saveQrCode2PNG}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={copyQrCode2Clipboard}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: "1rem", mt: "1rem" }}>
                            <Box
                                sx={{
                                    width: "8rem",
                                    py: "0.3rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                }}
                            >
                                {/* error correction select */}
                                <FormControl fullWidth>
                                    <InputLabel>EC Level</InputLabel>
                                    <Select
                                        fullWidth
                                        label="EC Level"
                                        defaultValue="M"
                                        size="small"
                                        onChange={setQrErrorCorrectionLevel}
                                    >
                                        <MenuItem value="L">L</MenuItem>
                                        <MenuItem value="M">M</MenuItem>
                                        <MenuItem value="Q">Q</MenuItem>
                                        <MenuItem value="H">H</MenuItem>
                                    </Select>
                                </FormControl>
                                {/* style select */}
                                <FormControl fullWidth>
                                    <InputLabel>Style</InputLabel>
                                    <Select
                                        fullWidth
                                        label="Style"
                                        defaultValue="squares"
                                        size="small"
                                        onChange={setQrStyle}
                                    >
                                        <MenuItem value="squares">
                                            squares
                                        </MenuItem>
                                        <MenuItem value="dots">dots</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* logo image input */}
                                <Button
                                    variant="contained"
                                    sx={{ height: "40px" }}
                                    fullWidth
                                    component="label"
                                >
                                    Logo Image
                                    <input
                                        hidden
                                        onChange={setQrImage}
                                        accept="image/*"
                                        type="file"
                                    />
                                </Button>
                                {/* eyeRadius Slider */}
                                <Box sx={{ mx: "0.5rem" }}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            lineHeight: "0.5rem",
                                            mb: "-0.25rem",
                                        }}
                                        color="GrayText"
                                    >
                                        Eye Radius
                                    </Typography>
                                    <Slider
                                        defaultValue={0}
                                        min={0}
                                        max={110}
                                        onChange={setQrEyeRadius}
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    width: "8rem",
                                    py: "0.3rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                }}
                            >
                                {/* eyecolor input */}
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    label="eyecolor"
                                    onChange={setQrEyeColor}
                                    defaultValue={qrCodeOptions.eyeColor
                                        ?.toString()
                                        .slice(1)}
                                    inputProps={{
                                        maxLength: 8,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                #
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* fgcolor input */}
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    label="fgcolor"
                                    defaultValue={qrCodeOptions.fgColor?.slice(
                                        1
                                    )}
                                    onChange={setQrFgColor}
                                    inputProps={{
                                        maxLength: 8,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                #
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* bgcolor input */}
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    label="bgcolor"
                                    defaultValue={qrCodeOptions.bgColor?.slice(
                                        1
                                    )}
                                    onChange={setQrBgColor}
                                    inputProps={{
                                        maxLength: 8,
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                #
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {/* Logo Size Slider */}
                                <Box sx={{ mx: "0.5rem" }}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            lineHeight: "0.5rem",
                                            mb: "-0.25rem",
                                        }}
                                        color="GrayText"
                                    >
                                        Logo Size
                                    </Typography>
                                    <Slider
                                        defaultValue={qrCodeOptions.logoWidth}
                                        min={10}
                                        max={440}
                                        onChange={setQrLogoSize}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="body1" color="initial">
                    linky.louay.ga is a tool to shorten a URL or reduce the
                    length of a link for making it easy to remember
                </Typography>
            </PaperWithInfo>
        </Box>
    );
}
