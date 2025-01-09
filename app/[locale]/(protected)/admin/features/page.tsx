// app/(protected)/admin/features/page.tsx
import { columns } from "./columns";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table"; // 

export default async function FeaturesPage() {
  const features = await db.feature.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // تنسيق التاريخ لتجنب أخطاء السيريalization
  const formattedFeatures = features.map(feature => ({
    ...feature,
    createdAt: feature.createdAt.toISOString(),
    updatedAt: feature.updatedAt.toISOString(),
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المميزات</h1>
          <p className="text-sm text-muted-foreground">
            إدارة المميزات التي تعرض في الموقع
          </p>
        </div>
        <Button >
          <Link href="/admin/features/create">
            <Plus className="w-4 h-4 ml-2" />
            إضافة ميزة
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={formattedFeatures} />
    </div>
  );
}