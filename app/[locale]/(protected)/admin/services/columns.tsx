"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Globe, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toggleServiceVisibility } from "@/actions/service"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export interface Service {
  id: number
  title_ar: string
  title_en: string
  subtitle_ar: string
  subtitle_en: string
  image: string | null
  isActive: boolean
  createdAt: string
  onDelete?: (service: Service) => void
}

export const columns: ColumnDef<Service>[] = [
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
              <div 
                className="max-w-[300px] prose prose-sm text-right"
                dir="rtl"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.title_ar.length > 100 
                    ? row.original.title_ar.substring(0, 100) + '...' 
                    : row.original.title_ar 
                }} 
              />
              <div 
                className="max-w-[300px] prose prose-sm text-muted-foreground"
                dir="ltr"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.title_en.length > 100 
                    ? row.original.title_en.substring(0, 100) + '...' 
                    : row.original.title_en 
                }} 
              />
            </>
          ) : (
            <>
              <div 
                className="max-w-[300px] prose prose-sm"
                dir="ltr"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.title_en.length > 100 
                    ? row.original.title_en.substring(0, 100) + '...' 
                    : row.original.title_en 
                }} 
              />
              <div 
                className="max-w-[300px] prose prose-sm text-muted-foreground"
                dir="rtl"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.title_ar.length > 100 
                    ? row.original.title_ar.substring(0, 100) + '...' 
                    : row.original.title_ar 
                }} 
              />
            </>
          )}
        </div>
      )
    }
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
              <div 
                className="max-w-[400px] line-clamp-1 prose prose-sm text-right"
                dir="rtl"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.subtitle_ar.length > 50 
                    ? row.original.subtitle_ar.substring(0, 50) + '...' 
                    : row.original.subtitle_ar 
                }} 
              />
              <div 
                className="max-w-[400px] line-clamp-1 prose prose-sm text-muted-foreground"
                dir="ltr"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.subtitle_en.length > 50 
                    ? row.original.subtitle_en.substring(0, 50) + '...' 
                    : row.original.subtitle_en 
                }} 
              />
            </>
          ) : (
            <>
              <div 
                className="max-w-[400px] line-clamp-1 prose prose-sm"
                dir="ltr"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.subtitle_en.length > 50 
                    ? row.original.subtitle_en.substring(0, 50) + '...' 
                    : row.original.subtitle_en 
                }} 
              />
              <div 
                className="max-w-[400px] line-clamp-1 prose prose-sm text-muted-foreground"
                dir="rtl"
                dangerouslySetInnerHTML={{ 
                  __html: row.original.subtitle_ar.length > 50 
                    ? row.original.subtitle_ar.substring(0, 50) + '...' 
                    : row.original.subtitle_ar 
                }} 
              />
            </>
          )}
        </div>
      )
    }
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
      const [isPending, setIsPending] = useState(false)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();

      const translations = {
        ar: {
          active: "مفعل",
          inactive: "معطل",
          updateSuccess: "تم تحديث حالة الخدمة بنجاح",
          updateError: "حدث خطأ أثناء تحديث حالة الخدمة"
        },
        en: {
          active: "Active",
          inactive: "Inactive",
          updateSuccess: "Service status updated successfully",
          updateError: "Error updating service status"
        }
      };

      const t = translations[locale as keyof typeof translations];

      const onToggle = async () => {
        try {
          setIsPending(true)
          const result = await toggleServiceVisibility(row.original.id)
          
          if (result.success) {
            toast.success(t.updateSuccess)
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          toast.error(t.updateError)
        } finally {
          setIsPending(false)
        }
      }

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
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;
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
                href={`/admin/services/${service.id}/edit`} 
                className="cursor-pointer flex items-center"
                locale={locale}
              >
                <Edit className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t.edit}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => service.onDelete?.(service)}
            >
              <Trash2 className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];