import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/schema";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { cookies, headers } from "next/headers";

interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginInput {
  email: string;
  password: string;
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

    // ตรวจสอบอีเมลในฐานข้อมูล
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    // ถ้าอีเมลมีอยู่ในฐานข้อมูลแล้ว ให้แสดงข้อความว่า "อีเมลนี้มีผู้ใช้งานแล้ว"
    if (existingUser) {
      return {
        message: "อีเมลนี้มีผู้ใช้งานแล้ว",
      };
    }

    // สร้าง salt สำหรับการเข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);

    // เข้ารหัสรหัสผ่านด้วย bcrypt โดยใช้ salt ที่สร้างขึ้น
    const hashedPassword = await bcrypt.hash(validated.data.password, salt);

    // สร้างผู้ใช้ใหม่ในฐานข้อมูลด้วยข้อมูลที่กรอก
    const newUser = await prisma.user.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        password: hashedPassword,
      },
    });

    // เข้ารหัส JWT_SECRET_KEY
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // สร้าง JWT token โดยใช้ข้อมูล id ของผู้ใช้
    const payload = {
      id: newUser.id,
    };

    // เข้ารหัส JWT token โดยใช้ secret key และ HS256 algorithm กำหนดเวลาเริ่มต้นและเวลาหมดอายุของ token = 1 วัน
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

export const login = async (input: LoginInput) => {
  try {
    // ตรวจสอบข้อมูลที่ผู้ใช้กรอก ว่าตรงตามที่กำหนดหรือไม่
    const validated = loginSchema.safeParse(input);

    if (!validated.success) {
      return {
        message: "กรุณากรอกข้อมูลให้ครบ",
        error: validated.error.flatten().fieldErrors,
      };
    }

    // หาอีเมลในฐานข้อมูล
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    // ถ้าพบอีเมลในฐานข้อมูล ให้แสดงข้อความว่า "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    if (!existingUser) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    // ถ้าอีเมลในฐานข้อมูลถูกต้อง ให้ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(
      validated.data.password, // รหัสผ่านที่ผู้ใช้กรอก
      existingUser.password // รหัสผ่านที่เก็บในฐานข้อมูล โดยเข้ารหัสแล้ว
    );

    // ถ้ารหัสผ่านไม่ถูกต้อง ให้แสดงข้อความว่า "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    if (!isPasswordValid) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    // ถ้ารหัสผ่านถูกต้อง ให้สร้าง JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // สร้าง JWT token โดยใช้ข้อมูล id ของผู้ใช้
    const payload = {
      id: existingUser.id,
    };

    // เข้ารหัส JWT token โดยใช้ secret key และ HS256 algorithm กำหนดเวลาเริ่มต้นและเวลาหมดอายุของ token = 1 วัน
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
    console.error("Error login user: ", err)
    return {
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    }
  }
}

// ดึงข้อมูลผู้ใช้งานปัจจุบันจาก headers และค้นหาข้อมูลจากฐานข้อมูล
export const getCurrentUser = async () => {
  try {
    // อ่าน headers จาก request
    const head = await headers();

    // ดึง user ID จาก header ชื่อ "x-user-id"
    const userId = head.get("x-user-id");

    // ถ้าไม่มี userId ใน header ให้คืนค่า null
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user
  } catch (err) {
    console.error("Error get current user: ", err);
    return null;
  }
}

// register({
//   name: "John Doe",
//   email: "John@gmail.com",
//   password: "@Password123",
//   confirmPassword: "@Password123",
// });

login({
  email: "John@gmail.com",
  password: "@Password123",
});
