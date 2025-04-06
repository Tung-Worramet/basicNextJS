import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { cookies } from "next/headers";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register = async (input: RegisterInput) => {
  try {
    const validated = registerSchema.safeParse(input);

    if (!validated.success) {
      // console.log(validated.error.flatten().fieldErrors);
      return {
        message: "กรุณากรอกข้อมูลให้ครบ",
        error: validated.error.flatten().fieldErrors,
      };
    }

    // console.log(validated.data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingUser) {
      return {
        message: "อีเมลนี้มีผู้ใช้งานแล้ว",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validated.data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
      },
    });

    // เข้ารหัส JWT_SECRET_KEY
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    const payload = {
      id: newUser.id,
    };

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // 1 day
      .sign(secret);

    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });
  } catch (err) {
    console.error("Error registration user: ", err);
    return {
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  }
};

// register({
//   name: "John Doe",
//   email: "John@gmail.com",
//   password: "@Password123",
//   confirmPassword: "@Password123",
// });
