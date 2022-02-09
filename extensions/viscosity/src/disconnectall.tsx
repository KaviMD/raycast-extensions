import { runAppleScriptSafe } from "./lib/util";
import { popToRoot, showHUD } from "@raycast/api";

export default async () => {
  const { result, error } = await runAppleScriptSafe(
    'tell application "Viscosity" to disconnectall',
    "Viscosity is not installed"
  );
  popToRoot();
  if (result !== undefined) {
    await showHUD("Disconnected from all servers");
  }
};
