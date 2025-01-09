"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Globe, MoreHorizontal } from "lucide-react"
import Link from "next/link"
// import { ServiceWithActions } from "@/types"
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
    header: "الصورة",
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
    header: "العنوان",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
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
        </div>
      )
    }
  },
  {
    id: "subtitle",
    header: "الوصف المختصر",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div 
            className="max-w-[400px] line-clamp-2 prose prose-sm text-right"
            dir="rtl"
            dangerouslySetInnerHTML={{ 
              __html: row.original.subtitle_ar.length > 150 
                ? row.original.subtitle_ar.substring(0, 150) + '...' 
                : row.original.subtitle_ar 
            }} 
          />
          <div 
            className="max-w-[400px] line-clamp-2 prose prose-sm text-muted-foreground"
            dir="ltr"
            dangerouslySetInnerHTML={{ 
              __html: row.original.subtitle_en.length > 150 
                ? row.original.subtitle_en.substring(0, 150) + '...' 
                : row.original.subtitle_en 
            }} 
          />
        </div>
      )
    }
  },
  {
    accessorKey: "isActive",
    header: "الحالة",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isPending, setIsPending] = useState(false)

      const onToggle = async () => {
        try {
          setIsPending(true)
          const result = await toggleServiceVisibility(row.original.id)
          
          if (result.success) {
            toast.success("تم تحديث حالة الخدمة بنجاح")
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          toast.error("حدث خطأ أثناء تحديث حالة الخدمة")
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
            {row.original.isActive ? "مفعل" : "معطل"}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/services/${service.id}/edit`} className="cursor-pointer">
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => service.onDelete?.(service)}
            >
              <Trash2 className="h-4 w-4 ml-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]