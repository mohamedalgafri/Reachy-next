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
import { Globe2 } from "lucide-react";
import { getCountryNameByCode } from '@/lib/countries';

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
                <TableHead className={`${locale === "ar" ? "text-right" : "text-left"}`}>
                  {locale === "ar" ? "الدولة" : "Country"}
                </TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {row.country === 'Unknown' ? (
                        <Globe2 className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <img
                          src={`https://flagcdn.com/w40/${row.country.toLowerCase()}.png`}
                          className="w-6 h-4 object-cover rounded"
                          alt={getCountryNameByCode(row.country, locale)}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
                          }}
                        />
                      )}
                      <span>{getCountryNameByCode(row.country, locale)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.visits.toLocaleString(locale === "ar" ? "ar-US" : "en-US")}
                  </TableCell>
                  <TableCell className="text-right">
                    {(row.percentage * 100).toLocaleString(locale === "ar" ? "ar-US" : "en-US", {
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