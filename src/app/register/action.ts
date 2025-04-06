"use server";

import { register } from "@/db/user";

export const registerAction = async (prevState: any, formData: FormData) => {
  const rowData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("ConfirmPassword") as string,
  };

  const result = await register(rowData);

  if (result && result.message) {
    return { success: false, message: result.message, errors: result.error };
  } else {
    return { success: true, message: "ลงทะเบียนสําเร็จ" };
  }
};
