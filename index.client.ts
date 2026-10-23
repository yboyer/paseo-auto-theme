import type { PluginClientContext } from '@getpaseo/plugin/client'

import { themeFor, type Scheme } from './client/palettes'
import { watchSystemAppearance } from './client/system-appearance'

export default function contribute(client: PluginClientContext): () => void {
  let current: Scheme | undefined
  let removeTheme: (() => void) | undefined
  let stopped = false

  const stopWatching = watchSystemAppearance(scheme => {
    if (stopped || current === scheme) return
    // Reuse the ID so Paseo keeps the user's selected theme across OS changes.
    // Registration must be synchronous: the host rejects duplicate theme IDs.
    removeTheme?.()
    removeTheme = client.addTheme(themeFor(scheme))
    current = scheme
  })

  return () => {
    if (stopped) return
    stopped = true
    stopWatching()
    removeTheme?.()
  }
}
