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
      setState({ items: await getConnections() });
    }
    fetchConnections();
  }, []);

  return (
    <List isLoading={state.items === undefined}>
      {state.items?.map((connection, index) => (
        <List.Item
          title={connection.name}
          key={index}
          icon={ConnectionStateIcons.get(connection.state)}
          subtitle={connection.state}
          accessoryIcon={Icon.Globe}
          accessoryTitle={connection.serverAddress}
          actions={<Actions connection={connection} />}
        />
      ))}
    </List>
  );
}

async function getConnections(): Promise<Connection[]> {
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
    return [];
  }

  const promises = result.split(", ").map(async (connectionName) => {
    const connection = await getConnectionState(connectionName);
    return connection;
  });

  const connections = await Promise.all(promises);

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
