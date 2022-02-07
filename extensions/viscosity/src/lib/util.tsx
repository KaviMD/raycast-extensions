import { showToast, ToastStyle, ImageLike, ImageMask, closeMainWindow } from "@raycast/api";
import { runAppleScript } from "run-applescript";

export interface State {
  items?: Map<string, Connection>;
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
  [
    ConnectionState.Connected,
    {
      source: "../assets/sf-symbols/lock.circle.fill@2x.green.png",
      mask: ImageMask.Circle,
    },
  ],
  [
    ConnectionState.Connecting,
    {
      source: "../assets/sf-symbols/lock.circle.fill@2x.orange.png",
      mask: ImageMask.Circle,
    },
  ],
  [
    ConnectionState.Disconnected,
    {
      source: "../assets/sf-symbols/lock.circle.fill@2x.gray.png",
      mask: ImageMask.Circle,
    },
  ],
]);

export async function runAppleScriptSafe(
  script: string,
  errorMessage: string,
  detailedErrorMessage = false
): Promise<{ result: string; error: string }> {
  try {
    return { result: await runAppleScript(script), error: "" };
  } catch (error) {
    showToast(
      ToastStyle.Failure,
      errorMessage,
      detailedErrorMessage ? String(error) : undefined
    );
    return { result: "", error: String(error) };
  }
}


export async function getConnectionState(connectionName: string): Promise<Connection> {
  const { result, error } = await runAppleScriptSafe(
    `
    tell application "Viscosity"
      set conName to "${connectionName}"
      set conState to the state of connections where name is equal to conName
      set conTimeConnected to the timeConnected of connections where name is equal to conName
      set conIPv4Address to the IPv4Address of connections where name is equal to conName
      set conIPv6Address to the IPv6Address of connections where name is equal to conName
      set conServerIPv4Address to the serverIPv4Address of connections where name is equal to conName
      set conServerIPv6Address to the serverIPv6Address of connections where name is equal to conName
      set conServerAddress to the serverAddress of connections where name is equal to conName
    end tell
    set stateData to {conState, conTimeConnected, conIPv4Address, conIPv6Address, conServerIPv4Address, conServerIPv6Address, conServerAddress}
    return stateData
    `,
    "Could not get connection state for " + connectionName
  );

  if (error !== "") {
    return {
      name: connectionName,
      state: ConnectionState.Error,
      timeConnected: "",
      IPv4Address: "",
      IPv6Address: "",
      serverIPv4Address: "",
      serverIPv6Address: "",
      serverAddress: "",
    };
  }

  const stateArray = result.split(", ");

  return {
    name: connectionName,
    state: stateArray[0] as ConnectionState,
    timeConnected: stateArray[1],
    IPv4Address: stateArray[2],
    IPv6Address: stateArray[3],
    serverIPv4Address: stateArray[4],
    serverIPv6Address: stateArray[5],
    serverAddress: stateArray[6],
  };
}

export async function connectTo(connection: Connection, closeMW = true) {
  connection.state = ConnectionState.Connecting;
  
  if (closeMW) {
    closeMainWindow();
  }
  
  runAppleScriptSafe(
    `
    tell application "Viscosity" to connect "${connection.name}"
    `,
    "Could not connect to " + connection.name
  );
}

export async function disconnectFrom(connection: Connection, closeMW = true) {
  connection.state = ConnectionState.Disconnecting;
  
  if (closeMW) {
    closeMainWindow();
  }
  
  runAppleScriptSafe(
    `
    tell application "Viscosity" to disconnect "${connection.name}"
    `,
    "Could not disconnect from " + connection.name
  );
}
