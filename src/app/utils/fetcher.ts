import { getAccessToken } from "./auth";

/**
 * Função fetcher para fazer requisições à API com autenticação.
 * @param endpoint - O endpoint da API a ser chamado.
 * @param options - Opções adicionais para a requisição fetch.
 * @param ctx - Contexto opcional, usado para obter cookies em SSR (não utilizado aqui).
 * @returns A resposta JSON da API.
 * @throws Erro se a requisição falhar ou se o token de acesso não estiver definido.
 */

export async function fetcher<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  ctx?: never
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL não está definida.");
  }

  const token = getAccessToken(ctx);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${baseUrl}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store", // opcional, força sempre buscar dados atualizados
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? `Erro: ${res.status}`);
  }

  return res.json();
}
