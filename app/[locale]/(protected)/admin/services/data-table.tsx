"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteService } from "@/actions/service";
import { Service } from "./columns";
import { useRouter } from "next/navigation";
import { useLocale } from 'next-intl';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Service, TValue>({
  columns: originalColumns,
  data: originalData,
}: DataTableProps<TData, TValue>) {
  const locale = useLocale();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  const router = useRouter();

  const translations = {
    ar: {
      searchPlaceholder: "بحث بالعنوان...",
      itemsPerPage: "عناصر كل صفحة:",
      results: "النتائج",
      of: "من",
      page: "صفحة",
      previous: "السابق",
      next: "التالي",
      noResults: "لا توجد نتائج.",
      deleteConfirmTitle: "تأكيد حذف الخدمة",
      deleteConfirmMessage: "هل أنت متأكد من حذف الخدمة التالية:",
      cancel: "إلغاء",
      deleting: "جاري الحذف...",
      confirmDelete: "تأكيد الحذف",
      deleteSuccess: "تم حذف الخدمة بنجاح",
      deleteError: "حدث خطأ أثناء حذف الخدمة"
    },
    en: {
      searchPlaceholder: "Search by title...",
      itemsPerPage: "Items per page:",
      results: "Results",
      of: "of",
      page: "Page",
      previous: "Previous",
      next: "Next",
      noResults: "No results found.",
      deleteConfirmTitle: "Confirm Service Deletion",
      deleteConfirmMessage: "Are you sure you want to delete the following service:",
      cancel: "Cancel",
      deleting: "Deleting...",
      confirmDelete: "Confirm Delete",
      deleteSuccess: "Service deleted successfully",
      deleteError: "Error deleting service"
    }
  };

  const t = translations[locale as keyof typeof translations];

  const data = React.useMemo(() => {
    return originalData.map(item => ({
      ...item,
      onDelete: (service: Service) => {
        setServiceToDelete(service);
        setShowDeleteAlert(true);
      }
    }));
  }, [originalData]);

  const table = useReactTable({
    data,
    columns: originalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const onDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setLoading(true);
      const result = await deleteService(serviceToDelete.id);
      if (result.success) {
        toast.success(t.deleteSuccess);
        router.refresh();
        setShowDeleteAlert(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(t.deleteError);
    } finally {
      setLoading(false);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <AlertDialog 
        open={showDeleteAlert} 
        onOpenChange={(open) => {
          if (!loading) {
            setShowDeleteAlert(open);
            if (!open) setServiceToDelete(null);
          }
        }}
      >
        <AlertDialogContent onInteractOutside={e => {
          if (loading) {
            e.preventDefault();
          }
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{t.deleteConfirmMessage}</p>
              <div className="font-medium text-black dark:text-white" 
                dir={locale === 'ar' ? 'rtl' : 'ltr'} 
                dangerouslySetInnerHTML={{ __html: locale === 'ar' ? serviceToDelete?.title_ar ?? '' : serviceToDelete?.title_en ?? '' }} 
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? t.deleting : t.confirmDelete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-5 justify-between">
        <Input
          placeholder={t.searchPlaceholder}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground hidden sm:flex">{t.itemsPerPage}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={locale === 'ar' ? "text-right" : "text-left"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={locale === 'ar' ? "text-right" : "text-left"}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={originalColumns.length}
                    className="h-24 text-center"
                  >
                    {t.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto justify-center">
          <span>{t.results}: {totalRows}</span>
          <span className="mx-1">|</span>
          <span>
            {totalRows > 0 ? `${startRow}-${endRow}` : '0'} {t.of} {totalRows}
          </span>
        </div>
        
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            {t.previous}
          </Button>
          
          <span className="flex items-center gap-1 text-sm">
            <span>{t.page}</span>
            <span className="font-medium">
              {pageIndex + 1}
            </span>
            <span>{t.of}</span>
            <span className="font-medium">
              {totalPages || 1}
            </span>
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            {t.next}
          </Button>
        </div>
      </div>
    </div>
  );
}