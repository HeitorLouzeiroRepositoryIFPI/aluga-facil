"use client";

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusBadgeProps {
  status: string;
  onStatusChange?: (newStatus: string) => void;
}

const STATUS_COLORS = {
  ATIVO: "bg-green-100 text-green-800 hover:bg-green-200",
  INATIVO: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  BLOQUEADO: "bg-red-100 text-red-800 hover:bg-red-200",
  DISPONIVEL: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  ALUGADO: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  MANUTENCAO: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  RESERVADO: "bg-orange-100 text-orange-800 hover:bg-orange-200"
};

const CLIENTE_STATUS_OPTIONS = [
  { label: "Ativo", value: "ATIVO" },
  { label: "Inativo", value: "INATIVO" },
  { label: "Bloqueado", value: "BLOQUEADO" }
];

const IMOVEL_STATUS_OPTIONS = [
  { label: "Disponível", value: "DISPONIVEL" },
  { label: "Alugado", value: "ALUGADO" },
  { label: "Manutenção", value: "MANUTENCAO" },
  { label: "Reservado", value: "RESERVADO" }
];

export function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const isClienteStatus = CLIENTE_STATUS_OPTIONS.some(opt => opt.value === status);
  const statusOptions = isClienteStatus ? CLIENTE_STATUS_OPTIONS : IMOVEL_STATUS_OPTIONS;
  const statusColor = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

  if (!onStatusChange) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${statusColor}`}>
        {status}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`cursor-pointer ${STATUS_COLORS[option.value as keyof typeof STATUS_COLORS]}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
