// src/hooks/useApiQuery.ts

import { fetcher } from "@/app/utils/fetcher";
import { useQuery, QueryKey, QueryFunction } from "@tanstack/react-query";
/**
 * Hook para realizar consultas à API usando React Query.
 *
 * @param key - Chave única para a consulta.
 * @param endpoint - Endpoint da API a ser consultado.
 * @param options - Opções adicionais para a requisição fetch.
 * @returns Resultado da consulta, incluindo dados, status e erros.
 */
export function useApiQuery<T = unknown>(
  key: QueryKey,
  endpoint: string,
  options?: RequestInit
) {
  const queryFn: QueryFunction<T> = () => fetcher<T>(endpoint, options);

  return useQuery<T>({
    queryKey: key,
    queryFn,
  });
}
