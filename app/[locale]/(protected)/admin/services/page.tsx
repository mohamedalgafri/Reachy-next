// app/(protected)/admin/services/page.tsx
import { columns } from "./columns";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";

export default async function ServicesPage() {
  const services = await db.service.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
          <p className="text-sm text-muted-foreground">
            قم بإدارة الخدمات التي تقدمها الشركة
          </p>
        </div>
        <Button >
          <Link className="flex gap-1" href="/admin/services/create">
            <Plus className="w-4 h-4" />
            إضافة خدمة
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={services} />
    </div>
  );
}