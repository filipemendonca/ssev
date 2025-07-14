import { toastError, toastSuccess } from "@/components/toasts";
import { GenericResponse } from "@/types";
import { fetcher } from "@/utils/fetcher";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook para realizar mutações na API usando React Query.
 *
 * @param endpoint - Endpoint da API a ser chamado.
 * @param method - Método HTTP a ser utilizado (POST, PUT, PATCH, DELETE).
 * @returns Função de mutação que pode ser usada para enviar dados à API.
 */

type Method = "POST" | "PUT" | "PATCH";

export function useApiMutation<T = unknown>(
  endpoint: string,
  method: Method = "POST"
) {
  return useMutation<T, Error, never>({
    mutationFn: async (data: never) => {
      return fetcher<T>(endpoint, {
        method,
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      const res = data as GenericResponse<T>;

      if (!res.success) {
        toastError({
          header: "Erro!",
          description: `${res.message}`,
        });
        return;
      }

      toastSuccess({
        header: "Sucesso!",
        description: res.message,
      });
    },
    onError: (error: Error) => {
      toastError({
        header: "Erro!",
        description: `Erro: ${error.message}`,
      });
    },
  });
}
