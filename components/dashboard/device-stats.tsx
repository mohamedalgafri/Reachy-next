import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Smartphone, Monitor, Tablet } from "lucide-react";

interface DeviceStatsProps {
    data: Array<{ deviceType: string; _count: number }>;
    locale: string;
}

export function DeviceStats({ data, locale }: DeviceStatsProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        {locale === "ar" ? "الأجهزة المستخدمة" : "Device Types"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        {locale === "ar" ? "لا توجد بيانات" : "No data available"}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const total = data.reduce((acc, curr) => acc + curr._count, 0);

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile': return Smartphone;
            case 'tablet': return Tablet;
            default: return Monitor;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {locale === "ar" ? "الأجهزة المستخدمة" : "Device Types"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map(({ deviceType, _count }) => {
                        const Icon = getDeviceIcon(deviceType);
                        const percentage = ((_count / total) * 100).toFixed(1);

                        return (
                            <div key={deviceType} className="flex items-center gap-4">
                                <Icon className="h-4 w-4" />
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">
                                            {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
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