import { runAppleScriptSafe } from "./lib/util";
import { closeMainWindow, popToRoot } from "@raycast/api"

export default async () => {
  runAppleScriptSafe(
    'tell application "Viscosity" to disconnectall',
    "Viscosity is not installed"
  );
  closeMainWindow();
  popToRoot();
};
