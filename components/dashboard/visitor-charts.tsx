import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface VisitorChartsProps {
  countryData: Array<{
    country: string;
    countryName: string;
    visits: number;
    percentage: number;
  }>;
  timeData: Array<{
    date: string;
    visits: number;
  }>;
  locale: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
                '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

export function VisitorCharts({ countryData, timeData, locale }: VisitorChartsProps) {
  const formatNumber = (number: number) => 
    number.toLocaleString(locale === "ar" ? "ar-SA" : "en-US");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-muted-foreground">
            {locale === "ar" ? "الزيارات: " : "Visits: "}
            {formatNumber(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* رسم بياني للدول */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>
            {locale === "ar" ? "توزيع الزيارات حسب الدولة" : "Visits by Country"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  dataKey="visits"
                  nameKey="countryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ countryName, percent }) => 
                    `${countryName} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* رسم بياني للزيارات حسب الوقت */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>
            {locale === "ar" ? "الزيارات حسب الوقت" : "Visits Over Time"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString(
                    locale === "ar" ? "ar-SA" : "en-US",
                    { month: 'short', day: 'numeric' }
                  )}
                />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visits" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}