import type { PluginClientContext } from '@getpaseo/plugin/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import contribute from '../index.client'
import { Appearance, AppState, Platform } from './react-native'

type Contribution = Parameters<PluginClientContext['addTheme']>[0]

function host() {
  const themes = new Map<string, Contribution>()
  const addTheme = vi.fn((theme: Contribution) => {
    if (themes.has(theme.id)) throw new Error(`Duplicate theme: ${theme.id}`)
    themes.set(theme.id, theme)
    return () => {
      themes.delete(theme.id)
    }
  })
  return {
    themes,
    addTheme,
    start: () =>
      contribute({ addTheme } as Pick<PluginClientContext, 'addTheme'> as PluginClientContext),
  }
}

function browser(dark: boolean) {
  const listeners = new Set<() => void>()
  const query = {
    matches: dark,
    addEventListener: vi.fn((_event: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_event: string, listener: () => void) =>
      listeners.delete(listener)
    ),
  }
  const matchMedia = vi.fn(() => query)
  vi.stubGlobal('matchMedia', matchMedia)
  return {
    matchMedia,
    listeners,
    emit: (next: boolean) => {
      query.matches = next
      for (const listener of listeners) listener()
    },
  }
}

beforeEach(() => {
  Platform.OS = 'web'
  vi.clearAllMocks()
  Appearance.getColorScheme.mockReturnValue('light')
})
afterEach(() => vi.unstubAllGlobals())

describe('adaptive theme registration', () => {
  it('starts in the OS mode and switches both ways without changing the selected ID', () => {
    const os = browser(false)
    const app = host()
    const stop = app.start()
    expect(os.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    expect(app.themes.get('auto')).toMatchObject({
      appearance: 'light',
      colors: { background: '#ffffff' },
    })
    os.emit(true)
    expect(app.themes.size).toBe(1)
    expect(app.themes.get('auto')).toMatchObject({
      appearance: 'dark',
      colors: { background: '#282c34', accent: '#89b4fa' },
    })
    os.emit(false)
    expect(app.themes.get('auto')?.appearance).toBe('light')
    stop()
  })

  it('starts dark, ignores repeated events, and releases listeners on unload', () => {
    const os = browser(true)
    const app = host()
    const stop = app.start()
    expect(app.themes.get('auto')?.appearance).toBe('dark')
    os.emit(true)
    expect(app.addTheme).toHaveBeenCalledTimes(1)
    stop()
    stop()
    expect(os.listeners.size).toBe(0)
    expect(app.themes.size).toBe(0)
    os.emit(false)
    expect(app.addTheme).toHaveBeenCalledTimes(1)
    const stopAgain = app.start()
    expect(app.themes.get('auto')?.appearance).toBe('light')
    stopAgain()
  })

  it('uses Light when a browser does not expose a system preference', () => {
    vi.stubGlobal('matchMedia', undefined)
    const app = host()
    const stop = app.start()
    expect(app.themes.get('auto')?.appearance).toBe('light')
    stop()
  })
})

describe.each(['ios', 'android'])('%s appearance', platform => {
  it('tracks native changes and resynchronizes when the app resumes', () => {
    Platform.OS = platform
    Appearance.getColorScheme.mockReturnValue('dark')
    const app = host()
    const stop = app.start()
    expect(app.themes.get('auto')?.appearance).toBe('dark')
    Appearance.getColorScheme.mockReturnValue('light')
    Appearance.addChangeListener.mock.calls[0]![0]()
    expect(app.themes.get('auto')?.appearance).toBe('light')
    Appearance.getColorScheme.mockReturnValue('dark')
    AppState.addEventListener.mock.calls[0]![1]('background')
    expect(app.themes.get('auto')?.appearance).toBe('light')
    AppState.addEventListener.mock.calls[0]![1]('active')
    expect(app.themes.get('auto')?.appearance).toBe('dark')
    stop()
    expect(Appearance.addChangeListener.mock.results[0]!.value.remove).toHaveBeenCalledOnce()
    expect(AppState.addEventListener.mock.results[0]!.value.remove).toHaveBeenCalledOnce()
  })

  it('falls back to Light when the native preference is unknown', () => {
    Platform.OS = platform
    Appearance.getColorScheme.mockReturnValue(null)
    const app = host()
    const stop = app.start()
    expect(app.themes.get('auto')?.appearance).toBe('light')
    stop()
  })
})
