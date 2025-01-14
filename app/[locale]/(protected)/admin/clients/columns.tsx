"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
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
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

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
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "الشعار" : "Logo";
    },
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
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "اسم العميل" : "Client Name";
    },
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
    header: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return locale === 'ar' ? "تاريخ الإضافة" : "Added Date";
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();
      return new Date(row.original.createdAt).toLocaleDateString(
        locale === 'ar' ? 'en-US' : 'en-US'
      );
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
      const [isPending, setIsPending] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const locale = useLocale();

      const translations = {
        ar: {
          active: "مفعل",
          inactive: "معطل",
          updateSuccess: "تم تحديث حالة العميل بنجاح",
          updateError: "حدث خطأ أثناء تحديث حالة العميل"
        },
        en: {
          active: "Active",
          inactive: "Inactive",
          updateSuccess: "Client status updated successfully",
          updateError: "Error updating client status"
        }
      };

      const t = translations[locale as keyof typeof translations];

      const onToggle = async () => {
        try {
          setIsPending(true);
          const result = await toggleClientVisibility(row.original.id);
          
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
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;
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
                href={`/admin/clients/${client.id}/edit`} 
                className="cursor-pointer flex items-center"
                locale={locale}
              >
                <Edit className={`h-4 w-4 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t.edit}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => client.onDelete?.(client)}
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