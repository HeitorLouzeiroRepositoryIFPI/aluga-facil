"use client";

import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface FilterOption {
  label: string;
  value: string;
}

interface ExtraFilter {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchPlaceholder?: string;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  extraFilter?: ExtraFilter;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  statusFilter,
  onStatusFilterChange,
  extraFilter
}: SearchFilterBarProps) {
  const statusOptions = [
    { label: "Todos", value: "TODOS" },
    { label: "Ativo", value: "ATIVO" },
    { label: "Inativo", value: "INATIVO" },
    { label: "Bloqueado", value: "BLOQUEADO" },
    { label: "Disponível", value: "DISPONIVEL" },
    { label: "Alugado", value: "ALUGADO" }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {extraFilter && (
          <select
            value={extraFilter.value}
            onChange={(e) => extraFilter.onChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {extraFilter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
