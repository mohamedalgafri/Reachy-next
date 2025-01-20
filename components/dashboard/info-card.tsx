import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: number;
  locale?: string;
}

export function InfoCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  locale = "en"
}: InfoCardProps) {
  const formattedTrend = trend?.toLocaleString(locale === "ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always'
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-2 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend !== undefined && (
                <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                  {formattedTrend}%
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}