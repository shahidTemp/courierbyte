// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
	phone: z.string().optional(),
});

const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 11);

export const Route = createFileRoute("/panel/fraud-checker")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { phone } = Route.useSearch();
	const [searchNumber, setSearchNumber] = useState(normalizePhone(phone ?? ""));

	useEffect(() => {
		setSearchNumber(normalizePhone(phone ?? ""));
	}, [phone]);

	return (
		<main className="p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-3xl">
				<label
					htmlFor="fraud-checker-phone"
					className="mb-2 block text-sm font-bold text-secondary-dark"
				>
					কাস্টমারের মোবাইল নাম্বার
				</label>
				<div className="flex flex-col gap-2 sm:flex-row">
					<input
						id="fraud-checker-phone"
						type="tel"
						inputMode="numeric"
						maxLength={11}
						value={searchNumber}
						onChange={(event) =>
							setSearchNumber(
								event.target.value.replace(/\D/g, "").slice(0, 11),
							)
						}
						placeholder="01XXXXXXXXX"
						className="h-14 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold tracking-wide text-slate-800 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
					/>
					<button
						type="button"
						className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/15 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20"
					>
						<Search className="h-4 w-4" />
						সার্চ করুন
					</button>
				</div>
			</div>
		</main>
	);
}
