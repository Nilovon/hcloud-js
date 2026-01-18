/**
 * Validation utilities for Hetzner Cloud Servers API
 */

import { z } from "zod";
import {
  listServersResponseSchema,
  serverSchema,
  createServerRequestSchema,
  createServerResponseSchema,
  getServerResponseSchema,
  updateServerRequestSchema,
  updateServerResponseSchema,
  deleteServerResponseSchema,
  getServerMetricsResponseSchema,
} from "./schemas";
import { HCloudError } from "../errors/index";

/**
 * Validates and parses a server object
 *
 * @param data - Data to validate
 * @returns Validated server object
 * @throws {HCloudError} If validation fails
 */
export function validateServer(data: unknown) {
  try {
    return serverSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new HCloudError(
        `Server validation failed: ${error.errors.map((e) => e.message).join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses a list servers response
 *
 * @param data - Data to validate
 * @returns Validated list servers response
 * @throws {HCloudError} If validation fails
 */
export function validateListServersResponse(data: unknown) {
  try {
    return listServersResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Provide detailed error messages
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `List servers response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Safe validation - returns a result object instead of throwing
 *
 * @param data - Data to validate
 * @returns Result object with success flag and data/error
 */
export function safeValidateServer(data: unknown):
  | {
      success: true;
      data: z.infer<typeof serverSchema>;
    }
  | {
      success: false;
      error: z.ZodError;
    } {
  const result = serverSchema.safeParse(data);
  if (result.success) {
    return result;
  }
  return result;
}

/**
 * Safe validation for list servers response
 *
 * @param data - Data to validate
 * @returns Result object with success flag and data/error
 */
export function safeValidateListServersResponse(data: unknown):
  | {
      success: true;
      data: z.infer<typeof listServersResponseSchema>;
    }
  | {
      success: false;
      error: z.ZodError;
    } {
  const result = listServersResponseSchema.safeParse(data);
  if (result.success) {
    return result;
  }
  return result;
}

/**
 * Validates create server request parameters
 *
 * @param data - Data to validate
 * @returns Validated create server request
 * @throws {HCloudError} If validation fails
 */
export function validateCreateServerRequest(data: unknown) {
  try {
    return createServerRequestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Create server request validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses a create server response
 *
 * @param data - Data to validate
 * @returns Validated create server response
 * @throws {HCloudError} If validation fails
 */
export function validateCreateServerResponse(data: unknown) {
  try {
    return createServerResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Create server response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses a get server response
 *
 * @param data - Data to validate
 * @returns Validated get server response
 * @throws {HCloudError} If validation fails
 */
export function validateGetServerResponse(data: unknown) {
  try {
    return getServerResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Get server response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates update server request parameters
 *
 * @param data - Data to validate
 * @returns Validated update server request
 * @throws {HCloudError} If validation fails
 */
export function validateUpdateServerRequest(data: unknown) {
  try {
    return updateServerRequestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Update server request validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses an update server response
 *
 * @param data - Data to validate
 * @returns Validated update server response
 * @throws {HCloudError} If validation fails
 */
export function validateUpdateServerResponse(data: unknown) {
  try {
    return updateServerResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Update server response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses a delete server response
 *
 * @param data - Data to validate
 * @returns Validated delete server response
 * @throws {HCloudError} If validation fails
 */
export function validateDeleteServerResponse(data: unknown) {
  try {
    return deleteServerResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Delete server response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}

/**
 * Validates and parses a get server metrics response
 *
 * @param data - Data to validate
 * @returns Validated get server metrics response
 * @throws {HCloudError} If validation fails
 */
export function validateGetServerMetricsResponse(data: unknown) {
  try {
    return getServerMetricsResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => {
        const path = e.path.length > 0 ? e.path.join(".") : "root";
        return `${path}: ${e.message}`;
      });
      throw new HCloudError(
        `Get server metrics response validation failed: ${errorMessages.join(", ")}`,
        "VALIDATION_ERROR",
        0,
        { errors: error.errors },
      );
    }
    throw error;
  }
}
