/**
 * PM2 production process definition for the TanStack Start + Nitro server.
 *
 * Keep secrets in .env (which is gitignored), never in this file.
 * Node loads that file before Nitro imports the application bundle.
 */
module.exports = {
	apps: [
		{
			name: "courierByte",
			cwd: __dirname,

			// Nitro's Node production entrypoint, created by `npm run build`.
			script: "./.output/server/index.mjs",
			interpreter: "node",
			node_args: "--env-file=.env --no-network-family-autoselection",

			// Start with one process because the app currently uses in-memory caching.
			instances: 1,
			exec_mode: "fork",

			autorestart: true,
			min_uptime: "10s",
			max_restarts: 10,
			restart_delay: 3000,
			max_memory_restart: "500M",
			watch: false,
			time: true,

			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
