import { toastError, toastSuccess } from "@/components/toasts";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook para realizar mutações na API usando React Query.
 *
 * @param endpoint - Endpoint da API a ser chamado.
 * @param method - Método HTTP a ser utilizado (POST, PUT, PATCH, DELETE).
 * @returns Função de mutação que pode ser usada para enviar dados à API.
 */

type Method = "POST" | "PUT" | "PATCH";

interface UseApiMutationOptions {
  endpoint: string;
  method?: Method;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  queryKeys?: unknown[];
}

export function useApiMutation<T = unknown>({
  endpoint,
  method = "POST",
  showSuccessToast = true,
  showErrorToast = true,
  queryKeys = [],
}: UseApiMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation<T, Error, never>({
    mutationFn: async (data: never) => {
      return fetcher<T>(endpoint, {
        method,
        body: JSON.stringify(data),
        cache: "no-store",
      });
    },
    onSuccess: (data) => {
      const res = data as GenericResponse<T>;

      queryClient.invalidateQueries({ queryKey: queryKeys });

      if (showErrorToast && !res.success) {
        toastError({
          header: "Erro!",
          description: `${res.message}`,
        });
        return;
      }

      if (showSuccessToast && res.success) {
        toastSuccess({
          header: "Sucesso!",
          description: res.message,
        });
      }
    },
    onError: (error: Error) => {
      toastError({
        header: "Erro!",
        description: `Erro: ${error.message}`,
      });
    },
  });
}
