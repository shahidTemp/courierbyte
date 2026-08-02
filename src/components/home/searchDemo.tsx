import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles, XCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { bn, freeSearchDots } from "./constants";

export default function SearchDemo() {
	const [phone, setPhone] = useState("");
	const [used, setUsed] = useState(0);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPhone(event.target.value.replace(/\D/g, "").slice(0, 11));
		setMessage("");
		setError("");
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!/^01[3-9]\d{8}$/.test(phone)) {
			setError("সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন");
			return;
		}
		if (used >= 5) {
			setMessage(
				"আপনার আজকের ৫টি ফ্রি সার্চ শেষ। চালিয়ে যেতে লগইন করে একটি প্যাকেজ নিন।",
			);
			return;
		}
		setUsed((current) => current + 1);
		setMessage("ডেমো রিপোর্ট প্রস্তুত — আসল ডেটা কানেক্ট হলে এখানেই ফলাফল দেখাবে।");
	};

	return (
		<div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-3 shadow-[0_20px_70px_rgba(15,53,42,0.13)] sm:p-4">
			<div className="rounded-[1.15rem] bg-[#f4faf6] p-4 sm:p-5">
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h3 className="mt-1 text-xl font-extrabold text-slate-900">
						ফ্রিতে চেক করে দেখুন
					</h3>
					<div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-emerald-100">
						<div className="flex gap-1">
							{freeSearchDots.map((dot, index) => (
								<span
									key={dot}
									className={`h-2 w-2 rounded-full ${index < used ? "bg-emerald-500" : "bg-emerald-100"}`}
								/>
							))}
						</div>
						<span className="text-[11px] font-bold text-slate-600">
							আজ {bn(used)}/৫টি ফ্রি
						</span>
					</div>
				</div>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2.5 sm:flex-row"
				>
					<label className="relative flex-1">
						<span className="sr-only">কাস্টমারের মোবাইল নাম্বার</span>
						<span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-700">
							+880
						</span>
						<input
							type="tel"
							inputMode="numeric"
							value={phone}
							onChange={handleChange}
							placeholder="01XXXXXXXXX"
							className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-16 pr-4 text-base font-bold tracking-wider text-slate-800 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
						/>
					</label>
					<button
						type="submit"
						className="flex items-center justify-center gap-2 rounded-xl bg-[#0f6b4d] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition-all hover:-translate-y-0.5 hover:bg-[#0b583f] active:translate-y-0"
					>
						<Search className="h-4 w-4" /> রিপোর্ট দেখুন
					</button>
				</form>
				{error && (
					<p
						aria-live="polite"
						className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600"
					>
						<XCircle className="h-4 w-4" /> {error}
					</p>
				)}
				{message && (
					<div
						aria-live="polite"
						className="mt-3 rounded-xl bg-white px-3.5 py-3 ring-1 ring-emerald-100"
					>
						<p className="flex items-start gap-1.5 text-xs font-semibold leading-relaxed text-emerald-800">
							<Sparkles className="mt-0.5 h-4 w-4 shrink-0" /> {message}
						</p>
						{used >= 5 && (
							<div className="mt-3 flex flex-wrap gap-2">
								<Link
									to="/login"
									className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-emerald-700"
								>
									লগইন করে চালিয়ে যান <ArrowRight className="h-3.5 w-3.5" />
								</Link>
								<a
									href="#pricing"
									className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-50"
								>
									প্যাকেজ দেখুন
								</a>
							</div>
						)}
					</div>
				)}{" "}
			</div>
		</div>
	);
}
