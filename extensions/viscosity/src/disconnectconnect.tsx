import { List, Icon, ActionPanel } from "@raycast/api";
import { useEffect, useState } from "react";
import {
  Connection,
  ConnectionState,
  ConnectionStateIcons,
  State,
  runAppleScriptSafe,
  connectTo,
  disconnectFrom,
  getConnectionState,
} from "./lib/util";

export default function Command() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    async function fetchConnections() {
      const items = await getConnections();
      setState({ items });

      if (items) {
        Array.from(items).map(async ([name, connection], index) => {
          const c = await getConnectionState(name);
          items.set(name, c);
          setState({ items });
        });
      }
    }
    fetchConnections();
  }, []);

  return (
    <List isLoading={state.items === undefined}>
      {state.items !== undefined &&
        Array.from(state.items).map(([name, connection], index) => {
          return (
            <List.Item
              title={name}
              key={index}
              icon={ConnectionStateIcons.get(connection.state)}
              subtitle={connection.state}
              accessoryIcon={Icon.Globe}
              accessoryTitle={connection.serverAddress}
              actions={<Actions connection={connection} />}
            />
          );
        })}
    </List>
  );
}

async function getConnections(): Promise<State["items"]> {
  const { result, error } = await runAppleScriptSafe(
    `
    tell application "Viscosity"
      set conNames to name of connections
    end tell
    return conNames
    `,
    "Viscosity is not installed"
  );

  if (error !== "") {
    return new Map();
  }

  const connections: State["items"] = new Map();

  result.split(", ").map((connectionName) => {
    connections.set(connectionName, {
      name: connectionName,
      state: ConnectionState.Disconnected,
      timeConnected: "",
      IPv4Address: "",
      IPv6Address: "",
      serverIPv4Address: "",
      serverIPv6Address: "",
      serverAddress: "",
    });
  });

  return connections;
}

function Actions(props: { connection: Connection }) {
  return (
    <ActionPanel title={props.connection.name}>
      <ActionPanel.Section>
        {props.connection.state === ConnectionState.Connected && (
          <ActionPanel.Item
            title="Disconnect"
            onAction={() => disconnectFrom(props.connection)}
          />
        )}
        {props.connection.state === ConnectionState.Disconnected && (
          <ActionPanel.Item
            title="Disconnect"
            onAction={() => connectTo(props.connection)}
          />
        )}
      </ActionPanel.Section>
      <ActionPanel.Section></ActionPanel.Section>
    </ActionPanel>
  );
}
