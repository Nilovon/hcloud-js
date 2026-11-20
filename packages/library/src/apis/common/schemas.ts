/**
 * Zod schemas shared across API modules.
 */

import { z } from "zod";

/**
 * Pagination metadata schema
 * @see https://docs.hetzner.cloud/reference/cloud#pagination
 */
export const paginationMetaSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  previous_page: z.number().nullable(),
  next_page: z.number().nullable(),
  last_page: z.number().nullable(),
  total_entries: z.number().nullable(),
});

/**
 * `meta` object of list responses
 */
export const metaSchema = z.object({
  pagination: paginationMetaSchema.optional(),
});

/**
 * Labels: user-defined key/value pairs
 * @see https://docs.hetzner.cloud/reference/cloud#labels
 */
export const labelsSchema = z.record(z.string(), z.string());

/**
 * Price with net and gross amount, encoded as decimal strings
 */
export const priceSchema = z.object({
  net: z.string(),
  gross: z.string(),
});

/**
 * Deprecation information of a resource
 */
export const deprecationInfoSchema = z.object({
  announced: z.string(),
  unavailable_after: z.string(),
});

/**
 * Metrics time series: `[timestamp, value]` tuples keyed by series name
 */
export const timeSeriesSchema = z.record(
  z.string(),
  z.object({
    values: z.array(z.tuple([z.number(), z.string()])),
  }),
);

/**
 * Metrics object returned by the server and load balancer metrics endpoints
 */
export const metricsSchema = z.object({
  start: z.string(),
  end: z.string(),
  step: z.number(),
  time_series: timeSeriesSchema,
});
