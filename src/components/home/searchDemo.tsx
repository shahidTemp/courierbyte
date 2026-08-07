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
		<div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-3 shadow-[0_20px_70px_rgba(15,53,42,0.13)] sm:p-4">
			<div className="rounded-[1.15rem] bg-secondary/5 p-4 sm:p-5">
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
							className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-4 pr-4 text-base font-bold tracking-wider text-slate-800 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary/10"
						/>
					</label>
					<button
						type="submit"
						className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-secondary/15 transition-all hover:-translate-y-0.5 hover:bg-secondary-dark active:translate-y-0"
					>
						<Search className="h-4 w-4" /> ফলাফল দেখুন
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
			</div>
		</div>
	);
}
