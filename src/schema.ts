import * as yup from "yup"

export const shortenRequestSchema = yup.object({
    link: yup.string().url("Link must be a valid URL").required(),
    customLinky: yup
        .string()
        .matches(/^[a-zA-Z0-9]+$/,"Alphanumeric values only")
        .min(4,"Linky must be at least 4 characters")
        .nullable()
        .transform((value) => (value ? value : null))
    });


export const infoRequestSchema = yup.object({
    linky: yup
        .string()
        .matches(/^[a-zA-Z0-9]+$/, "Alphanumeric values only")
        .required("Linky field is required")
});