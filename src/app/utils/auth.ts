import { parseCookies } from "nookies";

/**
 * Retrieves the access token from cookies.
 * @param {Object} ctx - The context object, typically used in Next.js for server-side rendering.
 * @returns {string|null} The access token if it exists, otherwise null.
 */

export function getAccessToken(ctx?: never) {
  const cookies = parseCookies(ctx);
  return cookies["access_token"] || null;
}
