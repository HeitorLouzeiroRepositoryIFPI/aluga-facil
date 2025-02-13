"use client";

import React from 'react';
import { FiEdit, FiTrash2, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onAdd?: () => void;
  loading?: boolean;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onRefresh,
  onAdd,
  loading
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {onAdd && (
        <Button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          disabled={loading}
        >
          <FiPlus className="w-4 h-4" />
          Adicionar
        </Button>
      )}
      
      {onRefresh && (
        <Button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={loading}
        >
          <FiRefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      )}

      {onEdit && (
        <Button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800"
          variant="ghost"
          size="icon"
          disabled={loading}
        >
          <FiEdit className="w-4 h-4" />
        </Button>
      )}

      {onDelete && (
        <Button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
          variant="ghost"
          size="icon"
          disabled={loading}
        >
          <FiTrash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
