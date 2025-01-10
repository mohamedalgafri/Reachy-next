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
import { useLocale } from "next-intl";

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
    header: ({ column }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="whitespace-nowrap"
        >
          {locale === 'ar' ? 'الترتيب' : 'Order'}
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.getValue("order")}</div>
    )
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? 'العنوان' : 'Title';
    },
    cell: ({ row }) => row.original.title
  },
  {
    accessorKey: "page.title",
    header: ({ column }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? 'الصفحة' : 'Page';
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      const pageTitle = row.original.page?.title || (locale === 'ar' ? 'غير محدد' : 'Not specified');
      return <Badge variant="outline">{pageTitle}</Badge>;
    }
  },
  {
    accessorKey: "isVisible",
    header: ({ column }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? 'الحالة' : 'Status';
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, setIsPending] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      const section = row.original;

      const onToggle = async () => {
        try {
          setIsPending(true);
          const result = await toggleSectionVisibility(section.id);
          
          if (result.success) {
            toast.success(locale === 'ar' 
              ? "تم تحديث حالة القسم بنجاح"
              : "Section status updated successfully"
            );
            router.refresh();
          } else {
            toast.error(locale === 'ar'
              ? result.error || "حدث خطأ أثناء تحديث حالة القسم"
              : result.error || "Error updating section status"
            );
          }
        } catch (error) {
          toast.error(locale === 'ar'
            ? "حدث خطأ أثناء تحديث حالة القسم"
            : "Error updating section status"
          );
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
            {section.isVisible 
              ? (locale === 'ar' ? "ظاهر" : "Visible")
              : (locale === 'ar' ? "مخفي" : "Hidden")
            }
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? 'آخر تحديث' : 'Last Update';
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      const date = new Date(row.getValue("updatedAt"));
      return date.toLocaleDateString(locale === 'ar' ? 'en-US' : 'en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return (
        <Link href={`/admin/sections/${row.original.id}/edit`}>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 ml-2" />
            {locale === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
        </Link>
      );
    }
  }
];