"use client";

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface ExtraFilter {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: Array<{ value: string; label: string }>;
  extraFilter?: ExtraFilter;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  extraFilter
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {statusOptions.length > 0 && onStatusFilterChange && (
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          defaultValue={statusOptions[0].value}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {extraFilter && (
        <Select
          value={extraFilter.value}
          onValueChange={extraFilter.onChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {extraFilter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
