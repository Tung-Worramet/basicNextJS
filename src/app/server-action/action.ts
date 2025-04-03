"use server";

import { z } from "zod";

// สร้าง Schema
// const nameSchema = z.string().min(1, { message: "Name is required" });
// const ageSchema = z.number().min(1, { message: "Age is required" });

const userSchema = z.object({
  name: z.string().min(1, { message: "กรุณากรอกชื่อ" }),
  age: z
    .number({ message: "กรุณากรอกอายุ" })
    .min(10, { message: "อายุต้องมากกว่า 10 ปี" }),
});

// Server action Function
export const getName = async (prevState: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;

  // Validate the name using Zod schema
  const validated = userSchema.safeParse({ name: name, age: parseInt(age) });

  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  // Return the validated.data;
  return { success: true, data: "Ok" };
};
