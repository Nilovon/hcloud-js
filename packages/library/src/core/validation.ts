/**
 * Validation helpers built on Zod.
 */

import { z } from "zod";
import { HCloudValidationError, type ValidationIssue } from "./errors";

/**
 * Options for {@link validate}.
 */
export interface ValidateOptions {
  /**
   * Name used in the error message, e.g. `"Create server request"`.
   */
  context: string;
  /**
   * Include the path of every invalid value in the error message.
   * @default true
   */
  detailed?: boolean;
  /**
   * Whether request parameters or an API response are validated.
   * @default "request"
   */
  target?: "request" | "response";
}

/**
 * Convert a `ZodError` into plain issues.
 */
export function toValidationIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: [...issue.path],
    message: issue.message,
    code: issue.code,
  }));
}

/**
 * Format validation issues as a single line.
 */
export function formatValidationIssues(issues: ValidationIssue[], detailed = true): string {
  return issues
    .map((issue) => {
      if (!detailed) return issue.message;
      const path = issue.path.length > 0 ? issue.path.map(String).join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join(", ");
}

/**
 * Create a {@link HCloudValidationError} from a `ZodError`.
 */
export function createValidationError(
  error: z.ZodError,
  options: ValidateOptions,
): HCloudValidationError {
  const issues = toValidationIssues(error);
  return new HCloudValidationError(
    `${options.context} validation failed: ${formatValidationIssues(issues, options.detailed ?? true)}`,
    { target: options.target ?? "request", issues, cause: error },
  );
}

/**
 * Validate data against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param options - Validation options (context name for error messages)
 * @returns The parsed data
 * @throws {HCloudValidationError} If validation fails
 *
 * @example
 * ```typescript
 * import { validate, serverSchema } from "@nilovonjs/hcloud-js";
 *
 * const server = validate(serverSchema, data, { context: "Server" });
 * ```
 */
export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
  options: ValidateOptions,
): z.output<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw createValidationError(result.error, options);
}

/**
 * Validate data without throwing.
 *
 * @example
 * ```typescript
 * const result = safeValidate(serverSchema, data);
 * if (result.success) {
 *   console.log(result.data.name);
 * } else {
 *   console.error(result.error.issues);
 * }
 * ```
 */
export function safeValidate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): { success: true; data: z.output<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error as z.ZodError };
}
