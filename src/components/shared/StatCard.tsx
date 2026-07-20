'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    subtitle?: string;
    isLoading?: boolean;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'bg-[#4B5694]',
    subtitle,
    isLoading = false,
    trend
}: StatCardProps) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{title}</p>
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1" />
                        ) : (
                            <p className="text-2xl font-bold text-[#111844] mt-1">{value}</p>
                        )}
                        {subtitle && (
                            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                        )}
                        {trend && (
                            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;