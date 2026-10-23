import type { PluginClientContext } from "@getpaseo/plugin/client";
import { themesFor, type Scheme } from "./client/palettes";
import { watchSystemAppearance } from "./client/system-appearance";

export default function contribute(client: PluginClientContext): () => void {
  let current: Scheme | undefined;
  let removeThemes: (() => void)[] = [];
  let stopped = false;

  const stopWatching = watchSystemAppearance((scheme) => {
    if (stopped || current === scheme) return;
    // Reuse the ID so Paseo keeps the user's selected theme across OS changes.
    // Registration must be synchronous: the host rejects duplicate theme IDs.
    for (const remove of removeThemes) remove();
    removeThemes = themesFor(scheme).map((theme) => client.addTheme(theme));
    current = scheme;
  });

  return () => {
    if (stopped) return;
    stopped = true;
    stopWatching();
    for (const remove of removeThemes) remove();
  };
}
