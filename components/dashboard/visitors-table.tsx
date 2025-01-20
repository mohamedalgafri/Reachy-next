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
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{locale === "ar" ? "الدولة" : "Country"}</TableHead>
                <TableHead className="text-right">
                  {locale === "ar" ? "الزيارات" : "Visits"}
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
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flag.vercel.app/m/${row.country.toLowerCase()}.svg`}
                        className="w-6 h-4 object-cover rounded"
                        alt={row.countryName}
                      />
                      <span>{locale === "ar" ? row.countryName : row.countryName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.visits.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </TableCell>
                  <TableCell className="text-right">
                    {(row.percentage * 100).toLocaleString(locale === "ar" ? "ar-SA" : "en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}