import { fetcher } from "../utils/fetcher";

export const api = {
  get: async <T = unknown>(url: string, ctx?: never) =>
    await fetcher<T>(url, {}, ctx),
  post: async <T = unknown>(url: string, body: never, ctx?: never) =>
    await fetcher<T>(
      url,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      ctx
    ),
  put: async <T = unknown>(url: string, body: never, ctx?: never) =>
    await fetcher<T>(
      url,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      ctx
    ),
  delete: async <T = unknown>(url: string, ctx?: never) =>
    await fetcher<T>(
      url,
      {
        method: "DELETE",
      },
      ctx
    ),
};
