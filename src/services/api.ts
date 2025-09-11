import { fetcher } from "../utils/fetcher";

export const api = {
  get: async <T = unknown>(url: string) => await fetcher<T>(url, {}),
  post: async <T = unknown>(url: string, body: never) =>
    await fetcher<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: async <T = unknown>(url: string, body: never) =>
    await fetcher<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: async <T = unknown>(url: string) =>
    await fetcher<T>(url, {
      method: "DELETE",
    }),
};
