import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chrome, Globe } from "lucide-react";

interface BrowserStatsProps {
  data: Array<{ browser: string; _count: number }>;
  locale: string;
}

export function BrowserStats({ data, locale }: BrowserStatsProps) {
  const total = data.reduce((acc, curr) => acc + curr._count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "المتصفحات" : "Browsers"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map(({ browser, _count }) => {
            const percentage = ((_count / total) * 100).toFixed(1);

            return (
              <div key={browser} className="flex items-center gap-4">
                <Globe className="h-4 w-4" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {browser.charAt(0).toUpperCase() + browser.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}