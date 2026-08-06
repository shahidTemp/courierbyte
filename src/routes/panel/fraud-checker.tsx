// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { checkFraud } from "@/server/functions/fraud.fn";

const searchSchema = z.object({
	phone: z.string().optional(),
});

const normalizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 11);
const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export const Route = createFileRoute("/panel/fraud-checker")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { phone } = Route.useSearch();
	const [searchNumber, setSearchNumber] = useState(normalizePhone(phone ?? ""));
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	const [isChecking, setIsChecking] = useState(false);

	useEffect(() => {
		setSearchNumber(normalizePhone(phone ?? ""));
	}, [phone]);

	const handleSearch = async () => {
		setResult(null);
		setError("");

		if (!BANGLADESHI_MOBILE.test(searchNumber)) {
			setError("A valid 11-digit phone number is required");
			return;
		}

		setIsChecking(true);
		try {
			const data = await checkFraud({ data: { phone: searchNumber } });
			setResult(data);
		} catch (checkError) {
			setError(
				checkError instanceof Error
					? checkError.message
					: "Fraud check could not be completed",
			);
		} finally {
			setIsChecking(false);
		}
	};

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
						onClick={handleSearch}
						disabled={isChecking}
						className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/15 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<Search className="h-4 w-4" />
						{isChecking ? "Checking..." : "সার্চ করুন"}
					</button>
				</div>

				{error && (
					<p
						className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
						role="alert"
					>
						<AlertCircle
							className="mt-0.5 size-4 shrink-0"
							aria-hidden="true"
						/>
						<span>{error}</span>
					</p>
				)}

				{result && (
					<div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
						<div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
							<CheckCircle2 className="size-4" aria-hidden="true" />
							Courier check completed
						</div>
						<pre className="max-h-96 overflow-auto bg-slate-950 p-4 text-xs leading-6 text-slate-200 sm:p-5 sm:text-sm">
							{JSON.stringify(result, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</main>
	);
}
