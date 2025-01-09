// app/(protected)/admin/features/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
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
          <div className="font-medium">
            {row.original.title_ar}
          </div>
          <div className="text-muted-foreground text-sm">
            {row.original.title_en}
          </div>
        </div>
      );
    },
  },
  {
    id: "subtitle",
    header: "الوصف المختصر",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
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
        </div>
      );
    },
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
          const result = await toggleFeatureVisibility(row.original.id)
          
          if (result.success) {
            toast.success("تم تحديث حالة الميزة بنجاح")
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          toast.error("حدث خطأ أثناء تحديث حالة الميزة")
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
      const feature = row.original
      
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
              <Link href={`/admin/features/${feature.id}/edit`} className="cursor-pointer">
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => feature.onDelete?.(feature)}
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