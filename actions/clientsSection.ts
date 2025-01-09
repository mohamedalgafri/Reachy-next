// actions/clientsSection.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface Client {
    name: string;
    image: string;
}

interface ClientData {
    clients: Client[];
}

export async function updateClientsSection(sectionId: number, data: ClientData) {
    try {
        if (!sectionId || !data.clients) {
            throw new Error("البيانات غير مكتملة");
        }

        // حذف الإدخالات القديمة
        await db.input.deleteMany({
            where: { sectionId }
        });

        // إنشاء مصفوفة من الإدخالات الجديدة
        const inputsToCreate = data.clients.flatMap((client, index) => [
            {
                label: `client_${index}_name`,
                type: 'TEXT',
                value: client.name,
                sectionId,
                order: index * 2
            },
            {
                label: `client_${index}_image`,
                type: 'IMAGE',
                value: client.image,
                sectionId,
                order: index * 2 + 1
            }
        ]);

        // إنشاء الإدخالات الجديدة
        await db.input.createMany({
            data: inputsToCreate
        });

        // تحديث الكاش
        revalidatePath('/admin/sections');

        return { 
            success: true,
            message: "تم تحديث قسم العملاء بنجاح"
        };
    } catch (error) {
        console.error("[UPDATE_CLIENTS_SECTION_ERROR]", error);
        if (error instanceof Error) {
            return { 
                success: false, 
                error: error.message
            };
        }
        return { 
            success: false, 
            error: "حدث خطأ أثناء تحديث قسم العملاء" 
        };
    }
}

export async function getClientsSection(sectionId: number) {
    try {
        const section = await db.section.findUnique({
            where: { id: sectionId },
            include: {
                inputs: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!section) {
            throw new Error("القسم غير موجود");
        }

        const clients: Client[] = [];
        let currentClient: Client = { name: '', image: '' };

        section.inputs.forEach(input => {
            const match = input.label.match(/client_(\d+)_(\w+)/);
            if (!match) return;

            const [, index, field] = match;
            
            if (field === 'name') {
                currentClient.name = input.value;
            } else if (field === 'image') {
                currentClient.image = input.value;
                clients.push({ ...currentClient });
                currentClient = { name: '', image: '' };
            }
        });

        return {
            clients
        };
    } catch (error) {
        console.error("[GET_CLIENTS_SECTION_ERROR]", error);
        throw error;
    }
}