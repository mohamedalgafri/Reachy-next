// components/dashboard/visitors-table.tsx
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
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  import { Info } from "lucide-react";
  import { getFormattedCountries } from '@/lib/countries';
  
  interface VisitData {
    countryCode: string;
    visits: number;
    percentage: string;
  }
  
  interface VisitorsTableProps {
    data: VisitData[];
    locale: string;
  }
  
  export function VisitorsTable({ data, locale }: VisitorsTableProps) {
    // الحصول على بيانات الدول
    const countries = getFormattedCountries(locale);
  
    // دمج بيانات الزيارات مع معلومات الدول
    const enrichedData = data.map(visit => {
      const countryInfo = countries.find(c => c.code === visit.countryCode) || {
        name: { ar: 'دول أخرى', en: 'Other Countries' },
        flag: '🌍',
        code: 'UN'
      };
  
      return {
        ...visit,
        countryName: locale === 'ar' ? countryInfo.name.ar : countryInfo.name.en,
        flag: countryInfo.flag
      };
    });
  
    // ترتيب البيانات حسب عدد الزيارات
    const sortedData = [...enrichedData].sort((a, b) => b.visits - a.visits);
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {locale === "ar" ? "توزيع الزيارات حسب الدول" : "Visits by Country"}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  {locale === "ar"
                    ? "يتم تحديد الدول تلقائياً باستخدام عنوان IP للزائر"
                    : "Countries are automatically detected using visitor's IP address"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">
                    {locale === "ar" ? "العلم" : "Flag"}
                  </TableHead>
                  <TableHead>
                    {locale === "ar" ? "الدولة" : "Country"}
                  </TableHead>
                  <TableHead className="text-center">
                    {locale === "ar" ? "عدد الزيارات" : "Visits"}
                  </TableHead>
                  <TableHead className="text-center">
                    {locale === "ar" ? "النسبة" : "Percentage"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-2xl text-center">
                      {item.flag}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.countryName}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.visits.toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                    </TableCell>
                    <TableCell className="text-center">
                      {locale === 'ar' 
                        ? item.percentage.replace('.', ',')
                        : item.percentage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
  
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {locale === 'ar' 
              ? `إجمالي الدول: ${data.length}`
              : `Total Countries: ${data.length}`}
          </div>
        </CardContent>
      </Card>
    );
  }