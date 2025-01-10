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
import { useLocale } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const locale  = useLocale();

  const table = useReactTable({
    data,
    columns,
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

  // حساب معلومات الصفحات
  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-5 justify-between">
        {/* حقل البحث */}
        <Input
          placeholder={`${locale === "ar" ? "بحث بالعنوان..." : "Search by title..."}`}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* اختيار عدد العناصر في الصفحة */}
        <div className="flex items-center  justify-between gap-4 ">
          <span className="text-sm text-gray-500 hidden sm:flex ">{locale === "ar" ? "عناصر كل صفحة:" : "Elements of each page:"}</span>
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

      {/* الجدول */}
      <style jsx>{`
            .table-container {
              width: calc(100vw - 35px);
              max-width: 100%;
            }

            @media (min-width: 767px) {
              .table-container {
                width: 100%;
              }
            }
          `}</style>
      <div className="rounded-md border overflow-hidden table-container">
        <div className="overflow-x-auto" >

          <div className="inline-block min-w-full align-middle m-auto  ">
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`${locale === "ar" ? "text-right" : ""}`}>
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
                    <TableCell key={cell.id}>
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {locale === "ar" ? "لا توجد نتائج." : "No results found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>
      </div>

      {/* الترقيم والتصفح */}
      <div className={`flex items-center justify-between ${locale === "ar" ? "rtl" : "ltr"}`}>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500  ">
          <span>{locale === "ar" ? "النتائج" : "Results"}: {totalRows}</span>
          <span>|</span>
          <span>
            {totalRows > 0 ? `${startRow}-${endRow}` : '0'} {locale === "ar" ? "من" : "from"} {totalRows}
          </span>
        </div>
        
        <div className="flex justify-center w-full sm:w-auto sm:justify-normal items-center gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {locale === "ar" ? "السابق" : "previous"}
          </Button>
          
          <span className="px-2">
          {locale === "ar" ? "صفحة" : "page"}{' '}
            <strong>
              {pageIndex + 1} {locale === "ar" ? "من" : "from"} {totalPages}
            </strong>
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {locale === "ar" ? "التالي" : "next"}
          </Button>
    
        </div>
      </div>
    </div>
  );
}