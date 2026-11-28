import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["logger", "summary", "ci-utils"].map((name) => ({
      test: {
        name,
        environment: "node",
        include: [`packages/tests/${name}.test.mjs`],
      },
    })),
  },
});
