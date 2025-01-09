// lib/counts.ts
import { db } from "@/lib/db";

export async function getUnreadCounts() {
  
  const unreadMessages = await db.contact.count({
    where: { isRead: false }
  });
  
  return {  unreadMessages };
}