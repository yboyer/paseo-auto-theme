import { vi } from "vite-plus/test";

export const Platform = { OS: "web" };
export const Appearance = {
  getColorScheme: vi.fn<() => "light" | "dark" | null>(() => "light"),
  addChangeListener: vi.fn((_listener: () => void) => ({ remove: vi.fn() })),
};
export const AppState = {
  addEventListener: vi.fn((_event: string, _listener: (state: string) => void) => ({
    remove: vi.fn(),
  })),
};
