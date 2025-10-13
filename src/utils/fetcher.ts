/**
 * Função fetcher para fazer requisições à API com autenticação.
 * @param endpoint - O endpoint da API a ser chamado.
 * @param options - Opções adicionais para a requisição fetch.
 * @param ctx - Contexto opcional, usado para obter cookies em SSR (não utilizado aqui).
 * @returns A resposta JSON da API.
 * @throws Erro se a requisição falhar ou se o token de acesso não estiver definido.
 */

import { getAccessToken, refreshToken } from "@/hooks/use-login";

export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  multipartFormData: boolean = false
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL não está definida.");
  }

  let token = await getAccessToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!multipartFormData) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const url = `${baseUrl}${endpoint}`;

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const { access_token } = await refreshToken();
    token = access_token;
    res = await fetch(`${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  }

  return res.json();
}
