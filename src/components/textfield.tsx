import { TextField, InputAdornment, Button } from "@mui/material";
import { MdOpenInNew, MdContentCopy } from "react-icons/md";

export default function CustomTextField(props: any) {
    return (
        <TextField
            sx={{ width: "100%" }}
            size="small"
            value={props.link}
            label={props.label}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                readOnly: true,
                endAdornment: (
                    <InputAdornment position="end">
                        <Button
                            onClick={() => {
                                if (props.link)
                                    window.open(
                                        "https://" + props.link.toString(),
                                        "_self"
                                    );
                            }}
                        >
                            Open
                            <MdOpenInNew style={{ marginLeft: 5 }} />
                        </Button>
                        <Button
                            onClick={() => {
                                if (props.link)
                                    navigator.clipboard.writeText(
                                        props.link.toString()
                                    );
                            }}
                        >
                            Copy
                            <MdContentCopy style={{ marginLeft: 5 }} />
                        </Button>
                    </InputAdornment>
                ),
            }}
        />
    );
}
