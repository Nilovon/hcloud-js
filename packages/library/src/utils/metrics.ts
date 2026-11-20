/**
 * Helpers for working with metrics.
 */

/**
 * Time series as returned by the metrics endpoints: `[timestamp, value]` tuples
 * with the value encoded as a string.
 */
export interface RawTimeSeries {
  [name: string]: { values: Array<[number, string]> };
}

/**
 * A single parsed metrics data point.
 */
export interface MetricPoint {
  /** Point in time of the measurement. */
  timestamp: Date;
  /** Measured value. */
  value: number;
}

/**
 * Convert raw metrics time series into `Date`/`number` data points.
 *
 * @example
 * ```typescript
 * const { metrics } = await client.servers.getMetrics(42, {
 *   type: "cpu",
 *   start: new Date(Date.now() - 3600_000),
 *   end: new Date(),
 * });
 *
 * const series = parseTimeSeries(metrics.time_series);
 * for (const point of series.cpu ?? []) {
 *   console.log(point.timestamp.toISOString(), point.value);
 * }
 * ```
 */
export function parseTimeSeries(timeSeries: RawTimeSeries): Record<string, MetricPoint[]> {
  const result: Record<string, MetricPoint[]> = {};
  for (const [name, series] of Object.entries(timeSeries)) {
    result[name] = series.values.map(([timestamp, value]) => ({
      timestamp: new Date(timestamp * 1000),
      value: Number(value),
    }));
  }
  return result;
}
