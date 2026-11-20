/**
 * Hetzner Cloud Pricing API
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

import { ApiResource } from "../../core/resource";
import type { RequestOptions } from "../../core/types";
import { getPricingResponseSchema } from "./schemas";
import type { GetPricingResponse } from "./types";

/**
 * Pricing API client
 *
 * Returns the prices of all resources available on the platform. VAT and
 * currency of the project owner are used for calculations.
 *
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */
export class PricingClient extends ApiResource {
  /**
   * Returns the prices of all resources.
   *
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
   *
   * @example
   * ```typescript
   * const { pricing } = await client.pricing.getAll();
   * console.log(pricing.currency, pricing.vat_rate);
   * ```
   */
  getAll(options?: RequestOptions): Promise<GetPricingResponse> {
    return this._get("/pricing", getPricingResponseSchema, undefined, options);
  }
}
