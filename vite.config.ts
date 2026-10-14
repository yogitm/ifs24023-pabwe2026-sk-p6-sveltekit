import { sveltekit } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-bun";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig, loadEnv } from "vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(process.env.APP_PORT || env.APP_PORT) || 3005;

  return {
    plugins: [
      sveltekit({
        adapter: adapter({
          envPrefix: "APP_",
          serverOptions: {
            port: port,
          },
        }),
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.{test,spec}.{js,ts}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        include: ["src/**/*.{ts,svelte}"],
        exclude: [
          "node_modules/",
          "src/setupTests.ts",
          "src/test-utils.ts",
          "src/routes/**/+error.svelte",
          "**/*.d.ts",
        ],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  };
});
