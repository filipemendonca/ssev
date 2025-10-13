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
  invalidateQueries?: boolean;
  invalidateQueryKeys?: unknown[];
  multipartFormData?: boolean;
}

export function useApiMutation<T = unknown>({
  endpoint,
  method = "POST",
  showSuccessToast = true,
  showErrorToast = true,
  queryKeys = [],
  invalidateQueries = false,
  invalidateQueryKeys = [],
  multipartFormData = false,
}: UseApiMutationOptions) {
  const queryClient = useQueryClient();

  let body: BodyInit | null | undefined = null;

  return useMutation<T, Error, never>({
    mutationKey: queryKeys,
    mutationFn: async (data: unknown) => {
      if (data instanceof FormData) {
        body = data;
      } else {
        body = JSON.stringify(data);
      }

      return fetcher<T>(
        endpoint,
        {
          method,
          body: body,
          cache: "no-store",
        },
        multipartFormData
      );
    },
    onSuccess: (data) => {
      const res = data as GenericResponse<T>;

      if (invalidateQueries)
        queryClient.invalidateQueries({ queryKey: invalidateQueryKeys });

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
