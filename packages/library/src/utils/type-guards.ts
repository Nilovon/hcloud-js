/**
 * Type guards for narrowing resources by their state.
 */

import type { Action } from "../apis/actions/types";
import type { Image } from "../apis/images/types";
import type { Server } from "../apis/servers/types";

/**
 * Check if an action is still running.
 */
export function isActionRunning(action: Action): action is Action & { status: "running" } {
  return action.status === "running";
}

/**
 * Check if an action has finished (successfully or not).
 */
export function isActionCompleted(
  action: Action,
): action is Action & { status: "success" | "error"; finished: string } {
  return action.status === "success" || action.status === "error";
}

/**
 * Check if an action finished successfully.
 */
export function isActionSuccessful(
  action: Action,
): action is Action & { status: "success"; finished: string } {
  return action.status === "success";
}

/**
 * Check if an action failed.
 */
export function isActionFailed(action: Action): action is Action & {
  status: "error";
  finished: string;
  error: { code: string; message: string };
} {
  return action.status === "error";
}

/**
 * Check if a server is running.
 */
export function isServerRunning(server: Server): server is Server & { status: "running" } {
  return server.status === "running";
}

/**
 * Check if a server is powered off.
 */
export function isServerStopped(server: Server): server is Server & { status: "off" } {
  return server.status === "off";
}

/**
 * Check if an image can be used.
 */
export function isImageAvailable(image: Image): image is Image & { status: "available" } {
  return image.status === "available";
}

/**
 * Check if an image is a snapshot.
 */
export function isSnapshot(image: Image): image is Image & { type: "snapshot" } {
  return image.type === "snapshot";
}

/**
 * Check if an image is a backup.
 */
export function isBackup(image: Image): image is Image & { type: "backup" } {
  return image.type === "backup";
}

/**
 * Check if an image is a system image provided by Hetzner.
 */
export function isSystemImage(image: Image): image is Image & { type: "system" } {
  return image.type === "system";
}
