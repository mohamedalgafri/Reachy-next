"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSectionVisibility } from "@/actions/toggle-section";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Section {
  id: number;
  title: string;
  order: number;
  isVisible: boolean;
  updatedAt: string;
  page: {
    title: string;
    slug: string;
  };
}

export const columns: ColumnDef<Section>[] = [
  {
    accessorKey: "order",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="whitespace-nowrap"
      >
        الترتيب
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("order")}</div>
    )
  },
  {
    accessorKey: "title",
    header: "العنوان",
    cell: ({ row }) => row.original.title
  },
  {
    accessorKey: "page.title",
    header: "الصفحة",
    cell: ({ row }) => {
      const pageTitle = row.original.page?.title || "غير محدد";
      return <Badge variant="outline">{pageTitle}</Badge>;
    }
  },
  {
    accessorKey: "isVisible",
    header: "الحالة",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, setIsPending] = useState(false);
      const section = row.original;

      const onToggle = async () => {
        try {
          setIsPending(true);
          const result = await toggleSectionVisibility(section.id);
          
          if (result.success) {
            toast.success("تم تحديث حالة القسم بنجاح");
            router.refresh();
          } else {
            toast.error(result.error || "حدث خطأ أثناء تحديث حالة القسم");
          }
        } catch (error) {
          toast.error("حدث خطأ أثناء تحديث حالة القسم");
        } finally {
          setIsPending(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Switch 
            checked={section.isVisible} 
            onCheckedChange={onToggle}
            disabled={isPending}
          />
          <span className={section.isVisible ? "text-green-600" : "text-gray-500"}>
            {section.isVisible ? "ظاهر" : "مخفي"}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "updatedAt",
    header: "آخر تحديث",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    }
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/sections/${row.original.id}/edit`}>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 ml-2" />
          تعديل
        </Button>
      </Link>
    )
  }
];