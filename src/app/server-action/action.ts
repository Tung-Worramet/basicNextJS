"use server";

import { z } from "zod";

const nameSchema = z.string().min(1, { message: "Name is required" });

// Server action Function
export const getName = async (prevState: any, formData: FormData) => {
    const name = formData.get("name");

    // Validate the name using Zod schema
    const validated = nameSchema.safeParse(name);

    return validated;
};