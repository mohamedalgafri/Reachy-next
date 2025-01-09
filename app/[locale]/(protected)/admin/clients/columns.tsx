"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toggleClientVisibility } from "@/actions/client"
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

interface Client {
  id: number
  name: string
  image: string
  isActive: boolean
  createdAt: string
  onDelete?: (client: Client) => void
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "image",
    header: "الشعار",
    cell: ({ row }) => (
      row.original.image && (
        <div className="relative h-12 w-12">
          <Image 
            src={row.original.image} 
            alt={row.original.name}
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
    accessorKey: "name",
    header: "اسم العميل",
    cell: ({ row }) => {
      return (
        <div dir="ltr" className="font-medium">
          {row.original.name}
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإضافة",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('ar-SA')
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
          const result = await toggleClientVisibility(row.original.id)
          
          if (result.success) {
            toast.success("تم تحديث حالة العميل بنجاح")
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          toast.error("حدث خطأ أثناء تحديث حالة العميل")
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
      const client = row.original
      
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
              <Link href={`/admin/clients/${client.id}/edit`} className="cursor-pointer">
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => client.onDelete?.(client)}
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