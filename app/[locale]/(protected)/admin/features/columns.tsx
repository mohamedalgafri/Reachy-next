"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toggleFeatureVisibility } from "@/actions/feature"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export interface Feature {
  id: number;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  onDelete?: (feature: Feature) => void;
}

export const columns: ColumnDef<Feature>[] = [
  {
    accessorKey: "image",
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "الصورة" : "Image";
    },
    cell: ({ row }) => (
      row.original.image && (
        <div className="relative h-12 w-12">
          <Image 
            src={row.original.image} 
            alt={row.original.title_ar}
            className="h-full w-full object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg"
            }}
            fill
          />
        </div>
      )
    ),
  },
  {
    id: "title",
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "العنوان" : "Title";
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return (
        <div className="space-y-1">
          {locale === 'ar' ? (
            <>
              <div className="font-medium">
                {row.original.title_ar}
              </div>
              <div className="text-muted-foreground text-sm">
                {row.original.title_en}
              </div>
            </>
          ) : (
            <>
              <div className="font-medium">
                {row.original.title_en}
              </div>
              <div className="text-muted-foreground text-sm">
                {row.original.title_ar}
              </div>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "subtitle",
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "الوصف المختصر" : "Brief Description";
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return (
        <div className="space-y-1">
          {locale === 'ar' ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-right block">
                    <div className="max-w-[300px] truncate">
                      {row.original.subtitle_ar}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p dir="rtl" className="max-w-sm whitespace-normal">
                      {row.original.subtitle_ar}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left block">
                    <div className="max-w-[300px] truncate text-muted-foreground text-sm">
                      {row.original.subtitle_en}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p dir="ltr" className="max-w-sm whitespace-normal">
                      {row.original.subtitle_en}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left block">
                    <div className="max-w-[300px] truncate">
                      {row.original.subtitle_en}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p dir="ltr" className="max-w-sm whitespace-normal">
                      {row.original.subtitle_en}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-right block">
                    <div className="max-w-[300px] truncate text-muted-foreground text-sm">
                      {row.original.subtitle_ar}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p dir="rtl" className="max-w-sm whitespace-normal">
                      {row.original.subtitle_ar}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "الحالة" : "Status";
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, setIsPending] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();

      const translations = {
        ar: {
          active: "مفعل",
          inactive: "معطل",
          updateSuccess: "تم تحديث حالة الميزة بنجاح",
          updateError: "حدث خطأ أثناء تحديث حالة الميزة"
        },
        en: {
          active: "Active",
          inactive: "Inactive",
          updateSuccess: "Feature status updated successfully",
          updateError: "Error updating feature status"
        }
      };

      const t = translations[locale as keyof typeof translations];

      const onToggle = async () => {
        try {
          setIsPending(true);
          const result = await toggleFeatureVisibility(row.original.id);
          
          if (result.success) {
            toast.success(t.updateSuccess);
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          toast.error(t.updateError);
        } finally {
          setIsPending(false);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Switch 
            checked={row.original.isActive} 
            onCheckedChange={onToggle}
            disabled={isPending}
          />
          <span className="text-sm text-muted-foreground">
            {row.original.isActive ? t.active : t.inactive}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const feature = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();

      const translations = {
        ar: {
          openMenu: "فتح القائمة",
          actions: "الإجراءات",
          edit: "تعديل",
          delete: "حذف"
        },
        en: {
          openMenu: "Open Menu",
          actions: "Actions",
          edit: "Edit",
          delete: "Delete"
        }
      };

      const t = translations[locale as keyof typeof translations];
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t.openMenu}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                href={`/admin/features/${feature.id}/edit`} 
                className="cursor-pointer flex items-center"
                locale={locale}
              >
                <Edit className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t.edit}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => feature.onDelete?.(feature)}
            >
              <Trash2 className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];