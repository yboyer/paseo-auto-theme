import { Appearance, AppState, Platform } from 'react-native'

import type { Scheme } from './palettes'
import { watchWebAppearance } from './web'

export function watchSystemAppearance(onChange: (scheme: Scheme) => void): () => void {
  // Read the OS preference directly on web, independently of Paseo's active theme.
  if (Platform.OS === 'web') return watchWebAppearance(onChange)

  const sync = () => onChange(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light')
  const appearance = Appearance.addChangeListener(sync)
  const appState = AppState.addEventListener('change', state => {
    if (state === 'active') sync()
  })
  sync()
  return () => {
    appearance.remove()
    appState.remove()
  }
}
