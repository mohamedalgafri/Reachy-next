import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface YearlyVisitsProps {
  data: Array<{
    date: string;
    visits: number;
  }>;
  locale: string;
}

export function YearlyVisitsChart({ data = [], locale }: YearlyVisitsProps) {
  // تجميع البيانات حسب الشهر
  const aggregatedData = data.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const monthKey = date.toLocaleDateString(locale === 'ar' ? 'ar-US' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        date: curr.date,
        visits: 0
      };
    }
    acc[monthKey].visits += curr.visits;
    return acc;
  }, {});

  const chartData = Object.values(aggregatedData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-US' : 'en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString(locale === 'ar' ? 'ar-US' : 'en-US');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-background/95 border rounded p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <p className="font-medium mb-1">
            {date.toLocaleDateString(locale === 'ar' ? 'ar-US' : 'en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p className="text-primary">
            {locale === 'ar' ? 'الزيارات: ' : 'Visits: '}
            <span className="font-medium">
              {formatNumber(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "إحصائيات الزيارات" : "Visit Statistics"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 40,
                }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ 
                    fill: 'hsl(var(--foreground))',
                    fontSize: 10,
                    angle: 0,
                    textAnchor: 'center',
                    dy: 10
                  }}
                  height={60}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tickFormatter={formatNumber}
                  tick={{ 
                    fill: 'hsl(var(--foreground))',
                    fontSize: 12
                  }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={CustomTooltip} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorVisits)"
                  dot={{
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    r: 4,
                    fill: 'hsl(var(--background))'
                  }}
                  activeDot={{
                    stroke: 'hsl(var(--primary))',
                    strokeWidth: 2,
                    r: 6,
                    fill: 'hsl(var(--background))'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
            {locale === "ar" ? "لا توجد بيانات للعرض" : "No data to display"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}