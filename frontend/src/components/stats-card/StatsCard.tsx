"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  color = "text-blue-600",
  icon
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      </div>
      <p className={cn("text-3xl font-semibold mt-2", color)}>{value}</p>
    </div>
  );
}
