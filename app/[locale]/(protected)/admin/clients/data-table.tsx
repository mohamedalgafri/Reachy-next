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
import { deleteClient } from "@/actions/client";
import { Client } from "./columns";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Client, TValue>({
  columns: originalColumns,
  data: originalData,
}: DataTableProps<TData, TValue>) {
  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  
  // Delete dialog state
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  const router = useRouter();

  // Add delete functionality to data
  const data = React.useMemo(() => {
    return originalData.map(item => ({
      ...item,
      onDelete: (client: Client) => {
        setClientToDelete(client);
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

  // Calculate page information
  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  // Delete function
  const onDelete = async () => {
    if (!clientToDelete) return;
    try {
      setLoading(true);
      const result = await deleteClient(clientToDelete.id);
      if (result.success) {
        toast.success("تم حذف العميل بنجاح");
        router.refresh();
        setShowDeleteAlert(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف العميل");
    } finally {
      setLoading(false);
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <AlertDialog 
        open={showDeleteAlert} 
        onOpenChange={(open) => {
          if (!loading) {
            setShowDeleteAlert(open);
            if (!open) setClientToDelete(null);
          }
        }}
      >
        <AlertDialogContent onInteractOutside={e => {
          if (loading) {
            e.preventDefault();
          }
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف العميل</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-right">
              <p>هل أنت متأكد من حذف العميل التالي:</p>
              <div className="font-medium text-black dark:text-white">
                {clientToDelete?.name}
              </div>
              <p className="text-red-600">
                سيتم حذف جميع البيانات المرتبطة به ولا يمكن التراجع عن هذا الإجراء.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              {loading ? "جاري الحذف..." : "تأكيد الحذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-5 justify-between">
        <Input
          placeholder="بحث باسم العميل..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground hidden sm:flex">عناصر كل صفحة:</span>
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
                    <TableHead key={header.id} className="text-right">
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
                      <TableCell key={cell.id} className="text-right">
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
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto justify-center">
          <span>النتائج: {totalRows}</span>
          <span className="mx-1">|</span>
          <span>
            {totalRows > 0 ? `${startRow}-${endRow}` : '0'} من {totalRows}
          </span>
        </div>
        
        <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            السابق
          </Button>
          
          <span className="flex items-center gap-1 text-sm">
            <span>صفحة</span>
            <span className="font-medium">
              {pageIndex + 1}
            </span>
            <span>من</span>
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
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}