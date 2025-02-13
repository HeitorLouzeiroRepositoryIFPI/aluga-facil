"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Column<T = any> {
  header: string;
  accessor: ((row: T) => React.ReactNode) | keyof T;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  error?: string | null;
}

export function DataTable<T extends { id?: number | string, codigo?: string }>({
  data,
  columns,
  currentPage,
  itemsPerPage,
  onPageChange,
  loading,
  error
}: DataTableProps<T>) {
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row) => {
              // Generate a unique key based on available identifiers
              const rowKey = row.id || row.codigo || Math.random().toString(36);
              return (
                <TableRow key={rowKey}>
                  {columns.map((column, index) => (
                    <TableCell key={`${rowKey}-${index}`}>
                      {typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
