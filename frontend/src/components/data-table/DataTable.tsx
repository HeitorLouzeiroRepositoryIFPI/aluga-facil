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
  onRowClick?: (row: T) => void;
  rowClassName?: string;
}

export function DataTable<T extends { id?: number | string, codigo?: string }>({
  data,
  columns,
  onRowClick,
  rowClassName
}: DataTableProps<T>) {
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const rowKey = row.id || row.codigo || Math.random().toString(36);
              return (
                <TableRow 
                  key={rowKey}
                  onClick={() => onRowClick?.(row)}
                  className={rowClassName}
                >
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
    </div>
  );
}
