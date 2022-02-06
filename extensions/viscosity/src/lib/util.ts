import { showToast, ToastStyle, ImageLike, ImageMask } from "@raycast/api";
import { runAppleScript } from "run-applescript";

export interface State {
  items?: Connection[];
  error?: Error;
}

export interface Connection {
  name: string;
  state: ConnectionState;
  timeConnected: string;
  IPv4Address: string;
  IPv6Address: string;
  serverIPv4Address: string;
  serverIPv6Address: string;
  serverAddress: string;
}

export enum ConnectionState {
  Connected = "Connected",
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  Disconnecting = "Disconnecting",
  Error = "Error",
}

export const ConnectionStateIcons: Map<ConnectionState, ImageLike> = new Map([
  [ConnectionState.Connected, { source: "../assets/sf-symbols/lock.circle.fill@2x.green.png", mask: ImageMask.Circle }],
  [ConnectionState.Connecting, { source: "../assets/sf-symbols/lock.circle.fill@2x.orange.png", mask: ImageMask.Circle }],
  [ConnectionState.Disconnected, { source: "../assets/sf-symbols/lock.circle.fill@2x.gray.png", mask: ImageMask.Circle }],
]);

export async function runAppleScriptSafe(
  script: string,
  errorMessage: string,
  detailedErrorMessage = false
): Promise<{ result: string; error: string }> {
  try {
    return { result: await runAppleScript(script), error: "" };
  } catch (error) {
    showToast(ToastStyle.Failure, errorMessage, detailedErrorMessage ? String(error) : undefined);
    return { result: "", error: String(error) };
  }
}

export async function connectTo(connectionName: string) {
    runAppleScriptSafe(`
    tell application "Viscosity" to connect "${connectionName}"
    `, "Could not connect to " + connectionName);
}

export async function disconnectFrom(connectionName: string) {
    runAppleScriptSafe(`
    tell application "Viscosity" to disconnect "${connectionName}"
    `, "Could not connect to " + connectionName);
}