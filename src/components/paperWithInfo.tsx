import { Box, Button, Paper } from "@mui/material";
import Link from "next/link";

export default function PaperWithInfo(props:any){
    return (
        <Box sx={{width:"100%",mb:"2rem", display:"flex", flexDirection:"column",alignItems:"center"}}>
            <Paper style={{ margin: "10px auto" }} {...props}></Paper>
            <Link
                href="https://www.louay.ga"
                style={{ textDecoration: "none"}}
            >
                <Button variant="contained" color="warning">
                    Created by Louay Ghanney
                </Button>
            </Link>
        </Box>
    );
}