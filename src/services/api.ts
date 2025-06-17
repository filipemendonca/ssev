import { fetcher } from "../utils/fetcher";

export const api = {
  get: <T = unknown>(url: string, ctx?: never) => fetcher<T>(url, {}, ctx),
  post: <T = unknown>(url: string, body: never, ctx?: never) =>
    fetcher<T>(
      url,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      ctx
    ),
  put: <T = unknown>(url: string, body: never, ctx?: never) =>
    fetcher<T>(
      url,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      ctx
    ),
  delete: <T = unknown>(url: string, ctx?: never) =>
    fetcher<T>(
      url,
      {
        method: "DELETE",
      },
      ctx
    ),
};
