import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BaseService } from "@/lib/services/BaseService";

/**
 * Generic hook that wires any BaseService to React Query.
 * Provides loading, error states, and automatic cache invalidation on mutations.
 */
export function useEntity<T extends { id: string }>(
  key: string,
  service: BaseService<T>,
  filters?: Record<string, unknown>
) {
  const queryClient = useQueryClient();
  const queryKey = [key, filters];

  const query = useQuery({
    queryKey,
    queryFn: () => service.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => service.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
