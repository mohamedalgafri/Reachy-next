// app/admin/sections/page.tsx
import { db } from "@/lib/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getLocale } from "next-intl/server";

export default async function SectionsPage() {
  const locale = getLocale();
  const sections = await db.section.findMany({
    include: {
      page: true,
      inputs: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{locale === 'ar' ? "إدارة الأقسام " : "Department management"} </h1>
          <p className="text-muted-foreground mt-1">{locale === 'ar' ? "قم بإدارة أقسام الموقع" : "Manage site sections"}</p>
        </div>
      </div>

      <DataTable columns={columns} data={sections} />
    </div>
  );
}