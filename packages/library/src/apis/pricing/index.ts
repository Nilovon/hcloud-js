/**
 * Hetzner Cloud Pricing API
 * @see https://docs.hetzner.cloud/reference/cloud#pricing
 */

import type { HCloudClient } from "@hcloud-js/client/index.js";
import type { GetPricingResponse } from "@hcloud-js/apis/pricing/types.js";
import { validate } from "@hcloud-js/validation/index.js";
import { getPricingResponseSchema } from "@hcloud-js/apis/pricing/schemas.js";

/**
 * Pricing API client
 */
export class PricingClient {
  constructor(private readonly client: HCloudClient) {}

  /**
   * Returns all prices for all resources.
   *
   * @returns Promise resolving to all pricing information
   * @see https://docs.hetzner.cloud/reference/cloud#pricing-get-all-prices
   *
   * @example
   * ```typescript
   * const client = new HCloudClient({ token: 'your-token' });
   *
   * // Get all prices
   * const pricing = await client.pricing.getAll();
   * console.log(`Currency: ${pricing.currency}`);
   * console.log(`VAT Rate: ${pricing.vat_rate}`);
   * console.log(`Server Types: ${pricing.server_types.length}`);
   * ```
   */
  async getAll(): Promise<GetPricingResponse> {
    const response = await this.client.get<unknown>("/pricing");

    return validate(getPricingResponseSchema, response, {
      context: "Get pricing response",
      detailed: true,
    });
  }
}
