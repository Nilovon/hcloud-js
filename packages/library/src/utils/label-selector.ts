/**
 * Build label selectors.
 * @see https://docs.hetzner.cloud/reference/cloud#label-selector
 */

/**
 * A single label condition.
 *
 * - `"value"` / `42`: label equals the value (`key=value`)
 * - `true`: label exists (`key`)
 * - `false`: label does not exist (`!key`)
 * - `["a", "b"]`: label is one of the values (`key in (a,b)`)
 * - `{ not: "value" }`: label does not equal the value (`key!=value`)
 * - `{ in: [...] }` / `{ notIn: [...] }`: set membership
 * - `{ exists: boolean }`: label exists / does not exist
 */
export type LabelCondition =
  | string
  | number
  | boolean
  | readonly (string | number)[]
  | { not: string | number }
  | { in: readonly (string | number)[] }
  | { notIn: readonly (string | number)[] }
  | { exists: boolean };

/**
 * Build a label selector string from an object. All conditions must match (AND).
 *
 * @example
 * ```typescript
 * labelSelector({ env: "production" });                  // "env=production"
 * labelSelector({ env: ["staging", "production"] });     // "env in (staging,production)"
 * labelSelector({ env: { not: "dev" }, managed: true }); // "env!=dev,managed"
 * labelSelector({ legacy: false });                      // "!legacy"
 *
 * const { servers } = await client.servers.list({
 *   label_selector: labelSelector({ env: "production", tier: ["web", "api"] }),
 * });
 * ```
 */
export function labelSelector(conditions: Record<string, LabelCondition | undefined>): string {
  const parts: string[] = [];

  for (const [key, condition] of Object.entries(conditions)) {
    if (condition === undefined) continue;

    if (typeof condition === "boolean") {
      parts.push(condition ? key : `!${key}`);
    } else if (typeof condition === "string" || typeof condition === "number") {
      parts.push(`${key}=${condition}`);
    } else if (isList(condition)) {
      parts.push(`${key} in (${condition.join(",")})`);
    } else if ("not" in condition) {
      parts.push(`${key}!=${condition.not}`);
    } else if ("in" in condition) {
      parts.push(`${key} in (${condition.in.join(",")})`);
    } else if ("notIn" in condition) {
      parts.push(`${key} notin (${condition.notIn.join(",")})`);
    } else if ("exists" in condition) {
      parts.push(condition.exists ? key : `!${key}`);
    }
  }

  return parts.join(",");
}

function isList(value: unknown): value is readonly (string | number)[] {
  return Array.isArray(value);
}
