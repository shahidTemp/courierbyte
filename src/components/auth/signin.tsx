// @ts-nocheck
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Phone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import { loginUser } from "@/server/functions/auth.fn";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignIn({ onSignUp }) {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!BANGLADESHI_MOBILE.test(phone)) {
			setError("সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন।");
			return;
		}

		if (password.length < 6) {
			setError("পাসওয়ার্ডে কমপক্ষে ৬টি অক্ষর থাকতে হবে।");
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const user = await loginUser({ data: { number: phone, password } });
			await refreshUser();
			await navigate({
				to:
					user.role === "admin" || user.role === "super_admin"
						? "/admin"
						: "/panel",
			});
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "লগইন করা যায়নি। পরে আবার চেষ্টা করুন।",
			);
			setIsSubmitting(false);
			return;
		}
	};

	return (
		<section className="relative isolate flex min-h-[38rem] items-center justify-center overflow-hidden bg-night px-4 py-14 sm:px-6">
			<div aria-hidden="true" className="pointer-events-none absolute -left-24 top-8 size-72 rounded-full bg-accent/10 blur-3xl" />
			<div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-secondary/20 blur-3xl" />
			<div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white p-6 shadow-2xl shadow-black/20 sm:p-9">
				<div className="mb-8">
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						লগইন করুন
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						আপনার মোবাইল নাম্বার ও পাসওয়ার্ড দিয়ে অ্যাকাউন্টে প্রবেশ করুন।
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit} noValidate>
					<div>
						<label
							htmlFor="phone"
							className="mb-2 block text-sm font-bold text-slate-700"
						>
							মোবাইল নাম্বার
						</label>
						<div className="relative">
							<Phone
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
								aria-hidden="true"
							/>
							<input
								id="phone"
								name="phone"
								type="tel"
								inputMode="numeric"
								autoComplete="tel-national"
								value={phone}
								onChange={(event) => {
									setPhone(event.target.value.replace(/\D/g, "").slice(0, 11));
									setError("");
								}}
								placeholder="01XXXXXXXXX"
								className="h-14 w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 pl-12 pr-4 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-bold text-slate-700"
						>
							পাসওয়ার্ড
						</label>
						<div className="relative">
							<LockKeyhole
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
								aria-hidden="true"
							/>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									setError("");
								}}
								placeholder="পাসওয়ার্ড লিখুন"
								className="h-14 w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
								aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{error && (
						<p
							className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
							role="alert"
						>
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="h-14 w-full rounded-2xl bg-accent text-sm font-extrabold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "লগইন হচ্ছে..." : "লগইন করুন"}
					</button>
				</form>

				{onSignUp && (
					<p className="mt-6 text-center text-sm text-slate-500">
						অ্যাকাউন্ট নেই?{" "}
						<button
							type="button"
							onClick={onSignUp}
							className="bg-gradient-to-r from-secondary to-accent bg-clip-text font-extrabold text-transparent transition focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2"
						>
							নতুন একাউন্ট তৈরি করুন
						</button>
					</p>
				)}
			</div>
		</section>
	);
}
