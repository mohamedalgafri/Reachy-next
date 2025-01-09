// actions/contact.ts
"use server";

import { db } from "@/lib/db";
import { ContactSchema, ContactType } from "@/types/form-types";
import { Resend } from 'resend';
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createContact(data: ContactType) {
  try {
    const validatedData = ContactSchema.parse(data);
    
    const contact = await db.contact.create({
      data: {
        ...validatedData,
        isRead: false
      }
    });

    await resend.emails.send({
      from: 'your-domain@resend.dev',
      to: 'mohamed18540000@gmail.com',
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong> ${validatedData.message}</p>
      `
    });

    return { success: true, message: "تم إرسال رسالتك بنجاح" };
  } catch (error) {
    console.error("[Server] Error in createContact:", error);
    return { success: false, message: "حدث خطأ أثناء إرسال الرسالة" };
  }
}

export async function getContacts() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return contacts;
  } catch (error) {
    console.error("[Server] Error fetching contacts:", error);
    return [];
  }
}

export async function markContactAsRead(id: number) {
  try {
    await db.contact.update({
      where: { id },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    console.error("[Server] Error marking contact as read:", error);
    return { success: false };
  }
}