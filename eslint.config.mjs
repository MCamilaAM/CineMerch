import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    // Existing effects restore browser storage and reset dialogs after hydration.
    // Keep this performance recommendation visible without changing those flows.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores(["work/**", "output/**"]),
]);
