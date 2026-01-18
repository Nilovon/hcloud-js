/**
 * Error handling for Hetzner Cloud API
 * @see https://docs.hetzner.cloud/reference/cloud#errors
 */

import type { ApiErrorResponse } from "../types/index.js";

/**
 * Hetzner Cloud API Error
 *
 * All API errors follow a consistent format with a code and message.
 * @see https://docs.hetzner.cloud/reference/cloud#errors
 */
export class HCloudError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly details?: ApiErrorResponse["error"]["details"],
  ) {
    super(message);
    this.name = "HCloudError";
  }

  /**
   * Check if error has field validation errors
   */
  hasFieldErrors(): boolean {
    return Boolean(this.details?.fields && this.details.fields.length > 0);
  }

  /**
   * Get field errors if available
   */
  getFieldErrors() {
    return this.details?.fields ?? [];
  }
}
