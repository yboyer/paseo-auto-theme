import type { Scheme } from './palettes'

interface ColorSchemeQuery {
  addEventListener(type: 'change', listener: () => void): void
  matches: boolean
  removeEventListener(type: 'change', listener: () => void): void
}

// Keep browser APIs isolated from the native runtime and the DOM-free project.
export function watchWebAppearance(onChange: (scheme: Scheme) => void): () => void {
  const browser = globalThis as typeof globalThis & {
    matchMedia?: (query: string) => ColorSchemeQuery
  }
  if (!browser.matchMedia) {
    onChange('light')
    return () => {}
  }
  const query = browser.matchMedia('(prefers-color-scheme: dark)')
  const sync = () => onChange(query.matches ? 'dark' : 'light')
  query.addEventListener('change', sync)
  sync()
  return () => query.removeEventListener('change', sync)
}
