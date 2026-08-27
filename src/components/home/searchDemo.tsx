// @ts-nocheck
import { useNavigate } from "@tanstack/react-router";
import { Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/userContext";

export default function SearchDemo() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");

	const handleChange = (event) => {
		setPhone(event.target.value.replace(/\D/g, "").slice(0, 11));
		setError("");
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!/^01[3-9]\d{8}$/.test(phone)) {
			setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন");
			return;
		}
		if (isLoading) return;
		void navigate(
			isAuthenticated
				? { to: "/panel/fraud-checker", search: { phone } }
				: { to: "/login" },
		);
	};

	return (
		<div className="rounded-[1.5rem] border border-white/10 bg-night-soft p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-4">
			<div className="rounded-[1.15rem] bg-white/[0.04] p-4 sm:p-5">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2.5 sm:flex-row"
				>
					<label className="relative flex-1">
						<span className="sr-only">গ্রাহকের মোবাইল নম্বর</span>
						<input
							type="tel"
							inputMode="numeric"
							value={phone}
							onChange={handleChange}
							placeholder="01XXXXXXXXX"
							className="w-full rounded-xl border border-white/10 bg-night py-4 pl-4 pr-4 text-base font-bold tracking-wider text-white outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-white/35 focus:border-accent focus:ring-4 focus:ring-accent/10"
						/>
					</label>
					<button
						type="submit"
						className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-white shadow-lg shadow-accent/15 transition-all hover:-translate-y-0.5 hover:bg-accent-strong active:translate-y-0"
					>
						<Search className="h-4 w-4" /> ফলাফল দেখুন
					</button>
				</form>
				{error && (
					<p
						aria-live="polite"
						className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-300"
					>
						<XCircle className="h-4 w-4" /> {error}
					</p>
				)}
			</div>
		</div>
	);
}
