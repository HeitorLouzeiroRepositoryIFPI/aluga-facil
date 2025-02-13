import { useState, useEffect } from 'react';

interface UseAsyncListOptions<T> {
  fetchItems: () => Promise<T[]>;
  dependencies?: any[];
  initialItems?: T[];
}

interface UseAsyncListResult<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useAsyncList<T>({
  fetchItems,
  dependencies = [],
  initialItems = []
}: UseAsyncListOptions<T>): UseAsyncListResult<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar itens'));
      console.error('Erro ao carregar itens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, dependencies);

  return {
    items,
    loading,
    error,
    refresh: loadItems
  };
}
