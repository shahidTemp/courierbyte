import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Phone } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/context/userContext";
import { loginUser } from "@/server/functions/auth.fn";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignIn({ onSignUp }: { onSignUp?: () => void }) {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
			await loginUser({ data: { number: phone, password } });
			await refreshUser();
			await navigate({ to: "/panel" });
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
		<section className="flex min-h-[32rem] items-center justify-center px-4 py-12 sm:px-6">
			<div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-secondary/10 sm:p-9">
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
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
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
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
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
						className="h-14 w-full rounded-2xl bg-secondary text-sm font-extrabold text-white shadow-lg shadow-secondary/20 transition focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
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
							className="bg-secondary bg-clip-text font-extrabold text-transparent transition focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:ring-offset-2"
						>
							সাইন আপ করুন
						</button>
					</p>
				)}
			</div>
		</section>
	);
}
