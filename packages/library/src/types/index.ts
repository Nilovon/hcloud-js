/**
 * Type definitions for Hetzner Cloud API
 */

/**
 * Error details field structure from Hetzner Cloud API
 */
export interface ErrorDetailsField {
  name: string;
  messages: string[];
}

/**
 * Error response structure from Hetzner Cloud API
 * @see https://docs.hetzner.cloud/reference/cloud#errors
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: {
      fields?: ErrorDetailsField[];
      [key: string]: unknown;
    };
  };
}

/**
 * HTTP request options
 */
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | string[] | undefined>;
  headers?: Record<string, string>;
}
