import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CountryData {
  country: string;
  countryName: string;
  visits: number;
  percentage: number;
}

interface VisitorsTableProps {
  data: CountryData[];
  locale: string;
}

export function VisitorsTable({ data, locale }: VisitorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "الزيارات حسب الدولة" : "Visits by Country"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{locale === "ar" ? "الدولة" : "Country"}</TableHead>
              <TableHead className="text-right">
                {locale === "ar" ? "عدد الزيارات" : "Visits"}
              </TableHead>
              <TableHead className="text-right">
                {locale === "ar" ? "النسبة" : "Percentage"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.country}>
                <TableCell className="font-medium">
                  {locale === "ar" ? row.countryName : row.countryName}
                </TableCell>
                <TableCell className="text-right">
                  {row.visits.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                </TableCell>
                <TableCell className="text-right">
                  {row.percentage.toLocaleString(locale === "ar" ? "ar-SA" : "en-US", {
                    style: "percent",
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}