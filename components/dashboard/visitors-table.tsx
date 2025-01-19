// components/dashboard/visitors-table.tsx
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VisitorsTableProps {
  data: {
    country: string;
    countryCode: string;
    visits: number;
    percentage: string;
  }[];
  locale: string;
}

export function VisitorsTable({ data, locale }: VisitorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "توزيع الزيارات حسب الدول" : "Visits by Country"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {locale === "ar" ? "الدولة" : "Country"}
              </TableHead>
              <TableHead className="text-right">
                {locale === "ar" ? "عدد الزيارات" : "Visits"}
              </TableHead>
              <TableHead className="text-right">
                {locale === "ar" ? "النسبة" : "Percentage"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.country}</TableCell>
                <TableCell className="text-right">
                  {item.visits.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                </TableCell>
                <TableCell className="text-right">
                  {locale === 'ar' 
                    ? item.percentage.replace('.', ',')
                    : item.percentage}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}