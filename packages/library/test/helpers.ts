/**
 * Test helpers: a client backed by a scripted fake `fetch`.
 */

import { BaseClient } from "../src/core/base-client";
import type { ClientOptions } from "../src/core/types";

/**
 * A request captured by the fake `fetch`.
 */
export interface RecordedRequest {
  method: string;
  url: URL;
  /** Path below the API base URL, e.g. `/servers/42`. */
  path: string;
  /** Host the request was sent to, e.g. `api.hetzner.cloud`. */
  host: string;
  /** Query parameters. Every value is an array, repeated keys are collected. */
  query: Record<string, string[]>;
  headers: Headers;
  /** Parsed JSON body, `undefined` if the request had no body. */
  body: unknown;
  signal: AbortSignal;
}

/**
 * A scripted reply: a JSON body (status 200), a `Response`, an `Error` to
 * simulate a network failure, or a function computing one of these.
 * `undefined` produces an empty `204` response.
 */
export type MockReply =
  | Response
  | Error
  | object
  | undefined
  | ((request: RecordedRequest) => Response | Error | object | undefined | Promise<Response | object | undefined>);

export interface MockClient<C extends BaseClient = BaseClient> {
  client: C;
  /** All requests sent so far. */
  requests: RecordedRequest[];
  /** The most recent request. Throws if none was sent. */
  last: () => RecordedRequest;
  /** Queue additional replies. */
  reply: (...replies: MockReply[]) => void;
}

/**
 * Build a JSON `Response`.
 */
export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

/**
 * Build an API error `Response`.
 */
export function apiError(
  status: number,
  code: string,
  message = "Something went wrong",
  extra: { details?: unknown; headers?: Record<string, string> } = {},
): Response {
  return json({ error: { code, message, details: extra.details ?? null } }, status, extra.headers);
}

/**
 * Create a fake `fetch` answering with the given replies in order. The last
 * reply is repeated once the queue is exhausted, until `reply()` queues new ones.
 */
export function createFetchMock(initial: MockReply[]): {
  fetch: NonNullable<ClientOptions["fetch"]>;
  requests: RecordedRequest[];
  reply: (...replies: MockReply[]) => void;
} {
  const queue: MockReply[] = [...initial];
  const requests: RecordedRequest[] = [];
  // Whether the last queued reply has been used already. New replies then replace it.
  let lastReplyServed = false;

  const fetch: NonNullable<ClientOptions["fetch"]> = async (input, init) => {
    const url = new URL(input);
    const query: Record<string, string[]> = {};
    for (const [key, value] of url.searchParams) (query[key] ??= []).push(value);

    const request: RecordedRequest = {
      method: init.method,
      url,
      path: url.pathname.replace(/^\/v1/, ""),
      host: url.host,
      query,
      headers: init.headers,
      body: init.body === undefined ? undefined : JSON.parse(init.body),
      signal: init.signal,
    };
    requests.push(request);

    if (init.signal.aborted) throw init.signal.reason ?? new Error("aborted");

    let next: MockReply;
    if (queue.length > 1) {
      next = queue.shift();
    } else {
      next = queue[0];
      lastReplyServed = true;
    }
    const resolved = typeof next === "function" ? await next(request) : next;
    if (resolved instanceof Error) throw resolved;
    if (resolved instanceof Response) return resolved;
    if (resolved === undefined) return new Response(null, { status: 204 });
    return json(resolved);
  };

  return {
    fetch,
    requests,
    reply: (...replies) => {
      if (lastReplyServed) queue.length = 0;
      lastReplyServed = false;
      queue.push(...replies);
    },
  };
}

const TEST_DEFAULTS: ClientOptions = {
  token: "test-token",
  retry: { baseDelay: 1, maxDelay: 5 },
  responseValidation: "throw",
  actions: { pollInterval: 1, timeout: 2000 },
};

/**
 * Create a `BaseClient` backed by a fake `fetch`.
 *
 * Responses are validated strictly (`responseValidation: "throw"`), so fixtures
 * that do not match the schemas fail the test.
 *
 * @example
 * ```typescript
 * const { client, last } = mockClient({ ssh_keys: [] });
 * await new SSHKeysClient(client).list({ name: "a" });
 * expect(last().path).toBe("/ssh_keys");
 * ```
 */
export function mockClient(
  replies: MockReply | MockReply[] = {},
  options: ClientOptions = {},
): MockClient {
  const mock = createFetchMock(Array.isArray(replies) ? replies : [replies]);
  const client = new BaseClient({ ...TEST_DEFAULTS, ...options, fetch: mock.fetch });
  return {
    client,
    requests: mock.requests,
    reply: mock.reply,
    last: () => {
      const request = mock.requests.at(-1);
      if (!request) throw new Error("No request was sent");
      return request;
    },
  };
}

/**
 * Options for a client backed by a fake `fetch`, for constructing other client classes.
 */
export function mockOptions(
  replies: MockReply | MockReply[] = {},
  options: ClientOptions = {},
): { options: ClientOptions; requests: RecordedRequest[]; reply: (...replies: MockReply[]) => void } {
  const mock = createFetchMock(Array.isArray(replies) ? replies : [replies]);
  return {
    options: { ...TEST_DEFAULTS, ...options, fetch: mock.fetch },
    requests: mock.requests,
    reply: mock.reply,
  };
}

/**
 * Build an action fixture.
 */
export function actionFixture(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    command: "start_server",
    status: "running" as "running" | "success" | "error",
    progress: 0,
    started: "2026-01-01T00:00:00+00:00",
    finished: null as string | null,
    resources: [{ id: 42, type: "server" }],
    error: null as { code: string; message: string } | null,
    ...overrides,
  };
}

/**
 * Build a `meta` fixture for list responses.
 */
export function metaFixture(overrides: Record<string, unknown> = {}) {
  return {
    pagination: {
      page: 1,
      per_page: 50,
      previous_page: null as number | null,
      next_page: null as number | null,
      last_page: 1,
      total_entries: 1,
      ...overrides,
    },
  };
}
