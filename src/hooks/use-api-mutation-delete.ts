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

interface Props {
  endpoint: string;
  hasBody: boolean;
  queryKeys?: unknown[];
  data?: never;
}

async function handleDelete<T>({ endpoint, hasBody, data }: Props) {
  return await fetcher<T>(endpoint, {
    method: "DELETE",
    body: hasBody ? JSON.stringify(data) : null,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

type ApiMutationProps = Omit<Props, "data">;

export function useApiMutationDelete<T = unknown>({
  endpoint,
  hasBody,
  queryKeys = [],
}: ApiMutationProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteItemAsync, data } = useMutation<T, Error, never>({
    mutationFn: () => handleDelete<T>({ endpoint, hasBody }),
    onSuccess: (data) => {
      const response = data as GenericResponse<T>;

      queryClient.invalidateQueries({ queryKey: queryKeys });

      if (!response.success) {
        toastError({
          header: "Erro!",
          description: `${response.message}`,
        });
        return;
      }

      toastSuccess({
        header: "Sucesso!",
        description: "Registro removido com sucesso!",
      });
    },
    onError: (error: Error) => {
      toastError({
        header: "Erro!",
        description: `Erro ao deletar o item: ${error.message}`,
      });
    },
  });

  return { deleteItemAsync, data };
}
