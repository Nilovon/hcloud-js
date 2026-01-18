/**
 * Type guards for runtime type checking
 */

import type { Action, ActionStatus } from "../apis/actions/types";
import type { Server, ServerStatus } from "../apis/servers/types";
import type { Image, ImageType, ImageStatus } from "../apis/images/types";

/**
 * Type guard to check if an action is completed (success or error)
 */
export function isActionCompleted(action: Action): action is Action & {
  status: "success" | "error";
  finished: string;
} {
  return action.status === "success" || action.status === "error";
}

/**
 * Type guard to check if an action was successful
 */
export function isActionSuccessful(action: Action): action is Action & {
  status: "success";
  finished: string;
} {
  return action.status === "success";
}

/**
 * Type guard to check if an action failed
 */
export function isActionFailed(action: Action): action is Action & {
  status: "error";
  finished: string;
  error: { code: string; message: string };
} {
  return action.status === "error";
}

/**
 * Type guard to check if a server is in a running state
 */
export function isServerRunning(server: Server): server is Server & {
  status: "running";
} {
  return server.status === "running";
}

/**
 * Type guard to check if a server is stopped
 */
export function isServerStopped(server: Server): server is Server & {
  status: "off";
} {
  return server.status === "off";
}

/**
 * Type guard to check if an image is available
 */
export function isImageAvailable(image: Image): image is Image & {
  status: "available";
} {
  return image.status === "available";
}

/**
 * Type guard to check if an image is a snapshot
 */
export function isSnapshot(image: Image): image is Image & {
  type: "snapshot";
} {
  return image.type === "snapshot";
}

/**
 * Type guard to check if an image is a backup
 */
export function isBackup(image: Image): image is Image & {
  type: "backup";
} {
  return image.type === "backup";
}

/**
 * Type guard to check if an image is a system image
 */
export function isSystemImage(image: Image): image is Image & {
  type: "system";
} {
  return image.type === "system";
}