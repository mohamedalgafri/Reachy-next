// actions/user.ts
"use server"

import * as z from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { userNameSchema, emailSchema, passwordSchema } from "@/lib/validations/user";
import { currentUser } from "@/lib/auth";

export type FormData = z.infer<typeof userNameSchema>;

export async function updateUserName(
  userId: string,
  values: FormData
) {
  try {
    const validatedFields = userNameSchema.safeParse(values);

    if (!validatedFields.success) {
      return { status: "error", message: "الاسم غير صالح" };
    }

    const { name } = validatedFields.data;

    await db.user.update({
      where: { id: userId },
      data: { name }
    });

    return { status: "success" };
  } catch (error) {
    return { status: "error", message: "حدث خطأ في تحديث الاسم" };
  }
}

export async function updateUserEmail(
  userId: string,
  values: z.infer<typeof emailSchema>
) {
  try {
    const validatedFields = emailSchema.safeParse(values);

    if (!validatedFields.success) {
      return { status: "error", message: "البريد الإلكتروني غير صالح" };
    }

    const { email } = validatedFields.data;

    // التحقق من وجود البريد الإلكتروني
    const existingUser = await getUserByEmail(email);

    if (existingUser && existingUser.id !== userId) {
      return { status: "error", message: "البريد الإلكتروني مستخدم بالفعل" };
    }

    await db.user.update({
      where: { id: userId },
      data: { email }
    });

    return { status: "success" };
  } catch (error) {
    return { status: "error", message: "حدث خطأ في تحديث البريد الإلكتروني" };
  }
}

export async function updateUserPassword(
  userId: string,
  values: z.infer<typeof passwordSchema>
) {
  try {
    const validatedFields = passwordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { status: "error", message: "كلمة المرور غير صالحة" };
    }

    const { password } = validatedFields.data;

    // تشفير كلمة المرور
    const hashedPassword = await hash(password, 12);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { status: "success" };
  } catch (error) {
    return { status: "error", message: "حدث خطأ في تحديث كلمة المرور" };
  }
}