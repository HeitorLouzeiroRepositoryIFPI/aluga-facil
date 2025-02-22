"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface DataTableState<T> {
  items: T[];
  filteredItems: T[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

interface UseDataTableStateProps<T> {
  fetchItems: () => Promise<T[]>;
  filterItems?: (items: T[], searchTerm: string, statusFilter: string) => T[];
  itemsPerPage?: number;
}

export function useDataTableState<T>({
  fetchItems,
  filterItems,
  itemsPerPage = 10
}: UseDataTableStateProps<T>) {
  const [state, setState] = useState<DataTableState<T>>({
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: 'TODOS',
    currentPage: 1,
    itemsPerPage
  });

  const loadItems = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchItems();
      
      if (Array.isArray(data)) {
        setState(prev => ({ 
          ...prev, 
          items: data,
          filteredItems: filterItems ? filterItems(data, prev.searchTerm, prev.statusFilter) : data
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Nenhum item encontrado',
          items: [],
          filteredItems: []
        }));
      }
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao carregar os itens',
        items: [],
        filteredItems: []
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (filterItems && state.items.length > 0) {
      const filtered = filterItems(state.items, state.searchTerm, state.statusFilter);
      setState(prev => ({ 
        ...prev, 
        filteredItems: filtered,
        currentPage: 1 // Reset to first page when filters change
      }));
    }
  }, [state.items, state.searchTerm, state.statusFilter]);

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const setStatusFilter = (status: string) => {
    setState(prev => ({ ...prev, statusFilter: status }));
  };

  const setCurrentPage = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const refresh = () => {
    loadItems();
  };

  return {
    ...state,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    refresh
  };
}
