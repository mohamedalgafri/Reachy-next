"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow, format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLocale } from 'next-intl';

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  isRead: boolean
  createdAt: Date
  onView?: (contact: Contact) => void
  onDelete?: (contact: Contact) => void
}

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ }) => {
      const locale = useLocale();
      return locale === 'ar' ? "الاسم" : "Name";
    },
  },
  {
    accessorKey: "email",
    header: ({ }) => {
      const locale = useLocale();
      return locale === 'ar' ? "البريد الإلكتروني" : "Email";
    },
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="truncate max-w-[200px] block">
            {row.original.email}
          </TooltipTrigger>
          <TooltipContent>
            <p dir="ltr">{row.original.email}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ }) => {
      const locale = useLocale();
      return locale === 'ar' ? "رقم الهاتف" : "Phone";
    },
  },
  {
    accessorKey: "subject",
    header: ({ }) => {
      const locale = useLocale();
      return locale === 'ar' ? "الموضوع" : "Subject";
    },
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="truncate max-w-[200px] block">
            {row.original.subject}
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.subject}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "createdAt",
    header: ({ }) => {
      const locale = useLocale();
      return locale === 'ar' ? "تاريخ الإرسال" : "Date";
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const locale = useLocale();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="block">
              {formatDistanceToNow(date, {
                addSuffix: true,
                locale: locale === 'ar' ? ar : undefined
              })}
            </TooltipTrigger>
            <TooltipContent>
              <p dir={locale === 'ar' ? "rtl" : "ltr"}>
                {format(date, 'dd/MM/yyyy - hh:mm a', { 
                  locale: locale === 'ar' ? ar : undefined 
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const locale = useLocale();
      const isUnread = !row.original.isRead
      
      return (
        <div className="flex gap-2 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => row.original.onView?.(row.original)}
                >
                  <Eye className="h-4 w-4" />
                  {isUnread && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{locale === 'ar' ? "عرض التفاصيل" : "View Details"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => row.original.onDelete?.(row.original)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{locale === 'ar' ? "حذف الرسالة" : "Delete Message"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
]