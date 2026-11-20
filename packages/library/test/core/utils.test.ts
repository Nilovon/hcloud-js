import { describe, expect, test } from "bun:test";
import { labelSelector } from "../../src/utils/label-selector";
import { parseTimeSeries } from "../../src/utils/metrics";
import {
  isActionCompleted,
  isActionFailed,
  isActionRunning,
  isActionSuccessful,
} from "../../src/utils/type-guards";
import { actionFixture } from "../helpers";

describe("labelSelector", () => {
  test("builds every kind of condition", () => {
    expect(labelSelector({ env: "production" })).toBe("env=production");
    expect(labelSelector({ replicas: 3 })).toBe("replicas=3");
    expect(labelSelector({ managed: true, legacy: false })).toBe("managed,!legacy");
    expect(labelSelector({ env: ["staging", "production"] })).toBe("env in (staging,production)");
    expect(labelSelector({ env: { not: "dev" } })).toBe("env!=dev");
    expect(labelSelector({ env: { in: ["a", "b"] } })).toBe("env in (a,b)");
    expect(labelSelector({ env: { notIn: ["a", "b"] } })).toBe("env notin (a,b)");
    expect(labelSelector({ a: { exists: true }, b: { exists: false } })).toBe("a,!b");
  });

  test("joins conditions and skips undefined", () => {
    expect(labelSelector({ env: "prod", tier: undefined, team: ["a", "b"], "!x": undefined })).toBe(
      "env=prod,team in (a,b)",
    );
    expect(labelSelector({})).toBe("");
  });
});

describe("parseTimeSeries", () => {
  test("converts timestamps and values", () => {
    expect(
      parseTimeSeries({
        cpu: {
          values: [
            [1767225600, "42.5"],
            [1767225660, "0"],
          ],
        },
      }),
    ).toEqual({
      cpu: [
        { timestamp: new Date("2026-01-01T00:00:00Z"), value: 42.5 },
        { timestamp: new Date("2026-01-01T00:01:00Z"), value: 0 },
      ],
    });
  });
});

describe("type guards", () => {
  test("actions", () => {
    const running = actionFixture();
    const success = actionFixture({ status: "success", finished: "2026-01-01T00:00:00+00:00" });
    const failed = actionFixture({ status: "error", error: { code: "x", message: "y" } });

    expect(isActionRunning(running)).toBe(true);
    expect(isActionCompleted(running)).toBe(false);
    expect(isActionCompleted(success)).toBe(true);
    expect(isActionSuccessful(success)).toBe(true);
    expect(isActionFailed(success)).toBe(false);
    expect(isActionFailed(failed)).toBe(true);
  });
});
