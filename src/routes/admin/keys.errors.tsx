// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, KeyRound, Search, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { KeyErrorBadge } from "@/components/admin/keyErrorBadge";
import { useAuth } from "@/context/userContext";
import { getKeyErrors } from "@/server/functions/keys.fn";
import { formateDate } from "@/utils/formateDate";

const searchSchema = z.object({
	keyId: z.string().optional(),
});

export const Route = createFileRoute("/admin/keys/errors")({
	validateSearch: searchSchema,
	component: KeyErrorsPage,
});

const KEY_ID_PATTERN = /^[a-f\d]{24}$/i;

const DeactivatedBadge = ({ deactivated }: { deactivated: boolean }) =>
	deactivated ? (
		<span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
			Deactivated
		</span>
	) : (
		<span className="text-slate-400 dark:text-gray-500">—</span>
	);

const TruncatedCell = ({
	value,
	className = "",
}: {
	value: string | null;
	className?: string;
}) =>
	value ? (
		<span title={value} className={`block max-w-52 truncate ${className}`}>
			{value}
		</span>
	) : (
		<span className="text-slate-300 dark:text-gray-600">—</span>
	);

function KeyErrorsPage() {
	const { user } = useAuth();
	const { keyId } = Route.useSearch();
	const [searchTerm, setSearchTerm] = useState("");

	// Ignore malformed ids so a hand-edited URL falls back to "all errors".
	const safeKeyId = keyId && KEY_ID_PATTERN.test(keyId) ? keyId : undefined;

	const { data, isPending, error } = useQuery({
		queryKey: ["key-errors", safeKeyId ?? "all"],
		queryFn: () => getKeyErrors({ data: { keyId: safeKeyId } }),
		enabled: user?.role === "super_admin",
	});

	if (user?.role !== "super_admin") {
		return (
			<main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
				<div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
					<AlertTriangle className="mx-auto mb-4 size-12 text-amber-600" />
					<h1 className="text-2xl font-extrabold text-amber-950">
						Super admin access required
					</h1>
					<p className="mt-2 text-amber-800">
						Only the super admin can view courier API key errors.
					</p>
				</div>
			</main>
		);
	}

	const errors = data?.errors ?? [];
	const filterKey = data?.key ?? null;

	const query = searchTerm.trim().toLowerCase();
	const filteredErrors = query
		? errors.filter((item) =>
				[
					item.keyValue,
					item.category,
					item.message,
					item.providerMessage,
					item.detail,
					item.phone,
				].some((value) =>
					String(value ?? "")
						.toLowerCase()
						.includes(query),
				),
			)
		: errors;

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<Link
							to="/admin/keys/all"
							className="mb-2 inline-flex items-center gap-1.5 text-sm font-bold text-secondary/70 transition hover:text-secondary"
						>
							<ArrowLeft aria-hidden="true" className="size-4" />
							Back to keys
						</Link>
						<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark">
							Key errors
						</h1>
						<p className="mt-1 text-sm font-medium text-slate-500">
							Courier API failure logs
							{filterKey
								? ` — filtered to ${filterKey.keyValue}`
								: safeKeyId
									? " — filtered to a deleted key"
									: " — all keys"}
						</p>
						{filterKey && (
							<span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-bold text-secondary-dark">
								<KeyRound aria-hidden="true" className="size-4" />
								{filterKey.keyValue}
								<Link
									to="/admin/keys/errors"
									search={{}}
									className="rounded-full p-0.5 transition hover:bg-secondary/20"
									aria-label="Clear key filter"
								>
									<X aria-hidden="true" className="size-3.5" />
								</Link>
							</span>
						)}
					</div>

					{data?.hasMore && (
						<p className="rounded-xl bg-secondary/5 px-4 py-2.5 text-xs font-semibold text-secondary/80">
							Showing the latest 100 errors — refine the search or filter by a
							key to see more.
						</p>
					)}

					<div className="relative w-full lg:w-72">
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
						/>
						<input
							aria-label="Search key errors"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search errors..."
							className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
						/>
					</div>
				</div>

				{isPending && (
					<p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
						Loading key errors...
					</p>
				)}

				{error && (
					<p
						role="alert"
						className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
					>
						{error instanceof Error
							? error.message
							: "Could not load key errors."}
					</p>
				)}

				{!isPending && !error && !filteredErrors.length && (
					<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center">
						<KeyRound className="mb-4 size-12 text-secondary/35" />
						<h2 className="text-xl font-extrabold text-secondary-dark">
							{query
								? "No matching errors"
								: safeKeyId
									? "No errors for this key"
									: "No key errors recorded"}
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							{query
								? "Try a different search term."
								: "Every courier provider failure will appear here."}
						</p>
					</div>
				)}

				{!isPending && !error && filteredErrors.length > 0 && (
					<>
						{/* Mobile cards */}
						<div className="space-y-4 md:hidden">
							{filteredErrors.map((item) => (
								<article
									key={item._id}
									className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
								>
									<div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
										<span className="font-mono text-xs font-bold text-secondary-dark">
											{item.keyValue ?? "No key"}
										</span>
										<KeyErrorBadge category={item.category} />
									</div>
									<dl className="divide-y divide-slate-100 text-sm">
										<div className="flex items-start justify-between gap-4 px-4 py-3">
											<dt className="shrink-0 font-semibold text-slate-500">
												Message
											</dt>
											<dd className="text-right font-medium text-slate-800">
												{item.message}
											</dd>
										</div>
										{item.providerMessage && (
											<div className="flex items-start justify-between gap-4 px-4 py-3">
												<dt className="shrink-0 font-semibold text-slate-500">
													Provider
												</dt>
												<dd className="text-right font-medium text-slate-800">
													{item.providerMessage}
												</dd>
											</div>
										)}
										{item.detail && (
											<div className="flex items-start justify-between gap-4 px-4 py-3">
												<dt className="shrink-0 font-semibold text-slate-500">
													Detail
												</dt>
												<dd className="text-right font-medium text-slate-800">
													{item.detail}
												</dd>
											</div>
										)}
										<div className="flex items-center justify-between gap-4 px-4 py-3">
											<dt className="font-semibold text-slate-500">HTTP</dt>
											<dd className="font-bold text-slate-800">
												{item.httpStatus ?? "—"}
											</dd>
										</div>
										<div className="flex items-center justify-between gap-4 px-4 py-3">
											<dt className="font-semibold text-slate-500">Phone</dt>
											<dd className="font-mono text-xs font-bold text-slate-800">
												{item.phone ?? "—"}
											</dd>
										</div>
										<div className="flex items-center justify-between gap-4 px-4 py-3">
											<dt className="font-semibold text-slate-500">Status</dt>
											<dd>
												<DeactivatedBadge deactivated={item.keyDeactivated} />
											</dd>
										</div>
										<div className="flex items-center justify-between gap-4 px-4 py-3">
											<dt className="font-semibold text-slate-500">Date</dt>
											<dd className="font-medium text-slate-800">
												{formateDate(item.createdAt)}
											</dd>
										</div>
									</dl>
								</article>
							))}
						</div>

						{/* Desktop table */}
						<div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
							<div className="overflow-x-auto">
								<table className="w-full min-w-[900px] border-collapse text-left">
									<thead>
										<tr className="bg-secondary text-left text-sm text-white">
											{[
												"Key",
												"Category",
												"Message",
												"Provider message",
												"Detail",
												"HTTP",
												"Status",
												"Date",
											].map((heading, index) => (
												<th
													className={`p-4 font-bold ${index === 0 ? "rounded-tl-2xl" : ""} ${index === 7 ? "rounded-tr-2xl" : ""}`}
													key={heading}
												>
													{heading}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{filteredErrors.map((item) => (
											<tr
												key={item._id}
												className="text-secondary-dark transition even:bg-slate-50 hover:bg-emerald-50/40 dark:text-white dark:even:bg-gray-800 dark:hover:bg-gray-800/80"
											>
												<td className="border-b border-slate-200 p-4 font-mono text-xs font-bold dark:border-gray-700">
													{item.keyValue ?? (
														<span className="text-slate-400">No key</span>
													)}
												</td>
												<td className="border-b border-slate-200 p-4 dark:border-gray-700">
													<KeyErrorBadge category={item.category} />
												</td>
												<td className="border-b border-slate-200 p-4 text-sm dark:border-gray-700">
													<TruncatedCell value={item.message} />
												</td>
												<td className="border-b border-slate-200 p-4 text-sm dark:border-gray-700">
													<TruncatedCell value={item.providerMessage} />
												</td>
												<td className="border-b border-slate-200 p-4 text-sm dark:border-gray-700">
													<TruncatedCell value={item.detail} />
												</td>
												<td className="border-b border-slate-200 p-4 font-bold dark:border-gray-700">
													{item.httpStatus ?? "—"}
												</td>
												<td className="border-b border-slate-200 p-4 dark:border-gray-700">
													<DeactivatedBadge deactivated={item.keyDeactivated} />
												</td>
												<td className="border-b border-slate-200 p-4 text-sm text-slate-500 dark:border-gray-700 dark:text-gray-400">
													{formateDate(item.createdAt)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
}
