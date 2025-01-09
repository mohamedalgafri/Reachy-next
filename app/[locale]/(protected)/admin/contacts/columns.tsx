"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow, format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
}

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
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
    header: "رقم الهاتف",
  },
  {
    accessorKey: "subject",
    header: "الموضوع",
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
    header: "تاريخ الإرسال",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="block">
              {formatDistanceToNow(date, {
                addSuffix: true,
                locale: ar
              })}
            </TooltipTrigger>
            <TooltipContent>
              <p dir="rtl">
                {format(date, 'dd/MM/yyyy - hh:mm a', { locale: ar })}
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
      const isUnread = !row.original.isRead
      
      return (
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
              <p>عرض التفاصيل</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
]