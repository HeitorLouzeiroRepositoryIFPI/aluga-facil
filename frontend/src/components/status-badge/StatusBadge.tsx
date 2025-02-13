"use client";

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type StatusType = string;

export type StatusColor = 'success' | 'danger' | 'warning' | 'info' | 'default';

export interface StatusConfig {
  label: string;
  color: StatusColor;
}

export interface StatusBadgeProps {
  status: StatusType;
  statusMap: Record<string, StatusConfig>;
  onStatusChange?: (newStatus: StatusType) => void;
}

const STATUS_COLORS = {
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  danger: "bg-red-100 text-red-800 hover:bg-red-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  default: "bg-gray-100 text-gray-800 hover:bg-gray-200"
};

export function StatusBadge({ status, statusMap, onStatusChange }: StatusBadgeProps) {
  const statusConfig = statusMap[status] || { label: status, color: 'default' };
  const statusColor = STATUS_COLORS[statusConfig.color] || STATUS_COLORS.default;

  if (!onStatusChange) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {statusConfig.label}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${statusColor}`}>
        {statusConfig.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusMap).map(([statusKey, config]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={() => onStatusChange(statusKey)}
            className={`cursor-pointer ${STATUS_COLORS[config.color]}`}
          >
            {config.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
