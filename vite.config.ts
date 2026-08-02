import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const config = ({ mode }: { mode: string }) => {
	const viteEnv = loadEnv(mode, process.cwd(), "");
	return defineConfig({
		resolve: { tsconfigPaths: true },
		server: { host: true, port: Number(viteEnv.PORT) || 3000 },
		plugins: [
			devtools(),
			nitro({
				plugins: ["./src/lib/db.ts"],
				rollupConfig: { external: [/^@sentry\//] },
			}),
			tailwindcss(),
			tanstackStart(),
			viteReact(),
			babel({ presets: [reactCompilerPreset()] }),
		],
	});
};

export default config;
