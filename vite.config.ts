import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: { options: { typeAware: true, typeCheck: true } },
  test: {
    include: ["tests/**/*.test.ts"],
    alias: { "react-native": new URL("./tests/react-native.ts", import.meta.url).pathname },
  },
});
