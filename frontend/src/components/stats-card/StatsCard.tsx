"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  color = 'blue',
  icon,
  className
}: StatsCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-600',
    red: 'bg-red-50 border-red-100 text-red-600'
  };

  return (
    <div className={cn(
      "p-6 rounded-xl shadow-sm border",
      colorStyles[color],
      className
    )}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-semibold mt-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
}
