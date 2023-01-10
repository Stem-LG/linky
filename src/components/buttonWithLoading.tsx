import { Button, ButtonProps, CircularProgress } from "@mui/material";

type propsType = {
    loadingState?: boolean;
};

export default function ButtonWithLoading({loadingState,...props}: propsType & ButtonProps) {
    return (
        <Button
            {...props}    
        >
            {loadingState ? (
                <>
                    <CircularProgress
                        size={20}
                        sx={{ mr: 1 }}
                        color="inherit"
                    />
                    Loading...
                </>
            ) : (
                props.children
            )}
        </Button>
    );
}
