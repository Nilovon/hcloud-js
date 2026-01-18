/**
 * Generic validation utilities for Hetzner Cloud API
 * Provides reusable validation functions that can be used across all API modules
 */

import { z } from "zod";
import { HCloudError } from "../errors/index";

/**
 * Options for validation error messages
 */
export interface ValidateOptions {
  /**
   * Name/context for the validation error message
   * Example: "Image", "Server", "List images response"
   */
  context: string;
  /**
   * Whether to include detailed path information in error messages
   * @default true
   */
  detailed?: boolean;
}

/**
 * Generic validation function that validates data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param options - Validation options (context name for error messages)
 * @returns Validated data with proper TypeScript typing
 * @throws {HCloudError} If validation fails
 *
 * @example
 * ```typescript
 * import { validate } from '../validation/index.js';
 * import { imageSchema } from './schemas.js';
 *
 * const image = validate(imageSchema, data, { context: 'Image' });
 * ```
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  options: ValidateOptions,
): z.infer<T> {
  try {
    return schema.parse(data) as z.infer<T>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const detailed = options.detailed ?? true;
      let errorMessage: string;

      if (detailed) {
        // Provide detailed error messages with paths
        const errorMessages = error.errors.map((e) => {
          const path = e.path.length > 0 ? e.path.join(".") : "root";
          return `${path}: ${e.message}`;
        });
        errorMessage = `${options.context} validation failed: ${errorMessages.join(", ")}`;
      } else {
        // Simple error message
        errorMessage = `${options.context} validation failed: ${error.errors.map((e) => e.message).join(", ")}`;
      }

      throw new HCloudError(errorMessage, "VALIDATION_ERROR", 0, { errors: error.errors });
    }
    throw error;
  }
}

/**
 * Safe validation - returns a result object instead of throwing
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Result object with success flag and data/error
 *
 * @example
 * ```typescript
 * import { safeValidate } from '../validation/index.js';
 * import { imageSchema } from './schemas.js';
 *
 * const result = safeValidate(imageSchema, data);
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function safeValidate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
):
  | {
      success: true;
      data: z.infer<T>;
    }
  | {
      success: false;
      error: z.ZodError;
    } {
  const result = schema.safeParse(data);
  if (result.success) {
    return result;
  }
  return result;
}
