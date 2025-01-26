import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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
  const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-US' : 'en-US', {
      month: 'long'
    });
  };

  const formatValue = (value: number) => {
    return Math.round(value).toLocaleString(locale === 'ar' ? 'ar-US' : 'en-US');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 p-3 border rounded-lg shadow">
          <p className="font-medium mb-1">
            {formatDate(label)}
          </p>
          <p className="text-primary">
            <span className="font-medium">
              {formatValue(payload[0].value)}
            </span>{' '}
            {locale === 'ar' ? 'زيارة' : 'visits'}
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
          {locale === "ar" ? "الزيارات الشهرية" : "Monthly Visits"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, 'auto']}
                tickCount={5}
                tickFormatter={formatValue}
                tick={{ fontSize: 12 }}
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
                  r: 4,
                  fill: 'hsl(var(--background))',
                  stroke: 'hsl(var(--primary))',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}