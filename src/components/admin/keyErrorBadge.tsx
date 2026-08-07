export const errorCategoryConfig = {
	KEYS_EXHAUSTED: {
		label: "Keys exhausted",
		classes:
			"bg-slate-100 text-slate-700 dark:bg-gray-700/50 dark:text-gray-300",
	},
	NETWORK_ERROR: {
		label: "Network error",
		classes:
			"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	},
	AUTH_FAILED: {
		label: "Auth failed",
		classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	},
	RATE_LIMITED: {
		label: "Rate limited",
		classes:
			"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	},
	PROVIDER_REJECTED: {
		label: "Rejected",
		classes:
			"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	},
	INVALID_RESPONSE: {
		label: "Bad response",
		classes: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
	},
} as const;

type ErrorCategoryKey = keyof typeof errorCategoryConfig;

/** Colored badge for a courier error category, with optional hover detail. */
export function KeyErrorBadge({
	category,
	title,
}: {
	category: string;
	title?: string;
}) {
	const config = errorCategoryConfig[category as ErrorCategoryKey] ?? {
		label: category,
		classes:
			"bg-slate-100 text-slate-700 dark:bg-gray-700/50 dark:text-gray-300",
	};
	return (
		<span
			title={title}
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.classes} ${title ? "cursor-help" : ""}`}
		>
			{config.label}
		</span>
	);
}
