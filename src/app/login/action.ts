"use server"

import { login } from "@/db/user";

export const loginAction = async (prevState: any, formData: FormData) => {
    const rowData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const result = await login(rowData);

    if (result && result.message) {
        return { success: false, message: result.message, errors: result.error };
    } else {
        return { success: true, message: "เข้าสู่ระบบสําเร็จ" };
    }
}