/**
 * Types shared across API modules.
 */

import type { z } from "zod";
import type {
  deprecationInfoSchema,
  labelsSchema,
  metricsSchema,
  priceSchema,
  timeSeriesSchema,
} from "./schemas";

export type { PageParams, PaginatedResponse, PaginationMeta } from "../../core/pagination";

/**
 * Labels: user-defined key/value pairs
 * @see https://docs.hetzner.cloud/reference/cloud#labels
 */
export type Labels = z.infer<typeof labelsSchema>;

/**
 * Price with net and gross amount, encoded as decimal strings
 */
export type Price = z.infer<typeof priceSchema>;

/**
 * Deprecation information of a resource
 */
export type DeprecationInfo = z.infer<typeof deprecationInfoSchema>;

/**
 * Metrics time series
 */
export type TimeSeries = z.infer<typeof timeSeriesSchema>;

/**
 * Metrics object returned by the metrics endpoints
 */
export type Metrics = z.infer<typeof metricsSchema>;

/**
 * Sort parameter for the given fields: `"name"`, `"name:asc"` or `"name:desc"`.
 * @see https://docs.hetzner.cloud/reference/cloud#sorting
 */
export type SortParam<Field extends string> = Field | `${Field}:asc` | `${Field}:desc`;

/**
 * One or many values. The API accepts repeated query parameters for these.
 */
export type OneOrMany<T> = T | readonly T[];

/**
 * Well-known location names. Other strings are accepted as well.
 */
export type LocationName = "fsn1" | "nbg1" | "hel1" | "ash" | "hil" | "sin" | (string & {});

/**
 * Well-known network zones. Other strings are accepted as well.
 */
export type NetworkZone = "eu-central" | "us-east" | "us-west" | "ap-southeast" | (string & {});
