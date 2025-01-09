// app/(protected)/admin/clients/page.tsx
import { columns } from "./columns";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة العملاء</h1>
          <p className="text-sm text-muted-foreground">
            قم بإدارة قائمة عملاء الشركة
          </p>
        </div>
        <Button >
          <Link href="/admin/clients/create">
            <Plus className="w-4 h-4 ml-2" />
            إضافة عميل
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={clients} />
    </div>
  );
}