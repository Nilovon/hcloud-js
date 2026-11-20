/**
 * Hetzner Storage Box Types API
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
 */

import { NamedResource, path } from "../../core/resource";
import type { ApiTarget, RequestOptions } from "../../core/types";
import { getStorageBoxTypeResponseSchema, listStorageBoxTypesResponseSchema } from "./schemas";
import type {
  GetStorageBoxTypeResponse,
  ListStorageBoxTypesParams,
  ListStorageBoxTypesResponse,
  StorageBoxType,
} from "./types";

/**
 * Storage Box Types API client
 *
 * Storage Box Types define the size, limits and price of a Storage Box.
 *
 * Storage Box Types are served by the Hetzner API (`https://api.hetzner.com/v1`),
 * not by the Hetzner Cloud API. The client selects the right host automatically.
 *
 * In addition to the methods below, the pagination helpers `iterate()`,
 * `iteratePages()`, `listAll()` and `first()` as well as `getByName()` are
 * available.
 *
 * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types
 */
export class StorageBoxTypesClient extends NamedResource<
  StorageBoxType,
  ListStorageBoxTypesParams,
  "storage_box_types"
> {
  protected readonly itemsKey = "storage_box_types";
  protected override readonly api: ApiTarget = "hetzner";

  /**
   * Returns a page of Storage Box Types.
   *
   * @param params - Name filter and pagination
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-list-storage-box-types
   *
   * @example
   * ```typescript
   * const { storage_box_types } = await client.storageBoxTypes.list();
   *
   * // All Storage Box Types across all pages
   * const all = await client.storageBoxTypes.listAll();
   * ```
   */
  list(
    params?: ListStorageBoxTypesParams,
    options?: RequestOptions,
  ): Promise<ListStorageBoxTypesResponse> {
    return this._get("/storage_box_types", listStorageBoxTypesResponseSchema, params, options);
  }

  /**
   * Returns a specific Storage Box Type.
   *
   * @param id - ID of the Storage Box Type
   * @param options - Request options
   * @see https://docs.hetzner.cloud/reference/hetzner#storage-box-types-get-a-storage-box-type
   *
   * @example
   * ```typescript
   * const { storage_box_type } = await client.storageBoxTypes.get(42);
   * console.log(storage_box_type.name, storage_box_type.size);
   * ```
   */
  get(id: number, options?: RequestOptions): Promise<GetStorageBoxTypeResponse> {
    return this._get(
      path`/storage_box_types/${id}`,
      getStorageBoxTypeResponseSchema,
      undefined,
      options,
    );
  }
}
