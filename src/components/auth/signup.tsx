import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Phone, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { createUser } from "@/server/functions/auth.fn";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignUp({ onLogin }: { onLogin?: () => void }) {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [errorField, setErrorField] = useState<
		"name" | "number" | "password" | "confirmPassword" | null
	>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const showError = (
		field: "name" | "number" | "password" | "confirmPassword",
		message: string,
	) => {
		setError(message);
		setErrorField(field);
	};

	const clearError = () => {
		setError("");
		setErrorField(null);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!name.trim()) {
			showError("name", "আপনার নাম লিখুন।");
			return;
		}

		if (!BANGLADESHI_MOBILE.test(number)) {
			showError("number", "সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন।");
			return;
		}

		if (password.length < 6) {
			showError("password", "পাসওয়ার্ডে কমপক্ষে ৬টি অক্ষর থাকতে হবে।");
			return;
		}

		if (password !== confirmPassword) {
			showError("confirmPassword", "দুটি পাসওয়ার্ড এক নয়।");
			return;
		}

		setError("");
		setErrorField(null);
		setIsSubmitting(true);

		try {
			await createUser({
				data: { name, number, password },
			});
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "অ্যাকাউন্ট তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।",
			);
			setIsSubmitting(false);
			return;
		}

		try {
			await navigate({ to: "/panel" });
		} catch {
			setError("প্যানেলে যাওয়া যায়নি। পরে আবার চেষ্টা করুন।");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="flex min-h-[38rem] items-center justify-center px-4 py-12 sm:px-6">
			<div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-secondary/10 sm:p-9">
				<div className="mb-8">
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						আপনার অ্যাকাউন্ট তৈরি করুন
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						কুরিয়ারবাইট ব্যবহার শুরু করতে নিচের তথ্যগুলো দিন।
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit} noValidate>
					<div>
						<label
							htmlFor="name"
							className="mb-2 block text-sm font-bold text-slate-700"
						>
							পুরো নাম
						</label>
						<div className="relative">
							<UserRound
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
								aria-hidden="true"
							/>
							<input
								id="name"
								name="name"
								aria-invalid={errorField === "name"}
								aria-describedby={
									errorField === "name" ? "form-error" : undefined
								}
								type="text"
								autoComplete="name"
								value={name}								onChange={(event) => {
									setName(event.target.value);
									clearError();
								}}
								placeholder="আপনার পুরো নাম লিখুন"
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="number"
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
								id="number"
								name="number"
								aria-invalid={errorField === "number"}
								aria-describedby={
									errorField === "number" ? "form-error" : undefined
								}
								type="tel"
								inputMode="numeric"
								autoComplete="tel-national"
								value={number}								onChange={(event) => {
									setNumber(event.target.value.replace(/\D/g, "").slice(0, 11));
									clearError();
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
								aria-invalid={errorField === "password"}
								aria-describedby={
									errorField === "password" ? "form-error" : undefined
								}
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								value={password}								onChange={(event) => {
									setPassword(event.target.value);
									clearError();
								}}
								placeholder="একটি পাসওয়ার্ড তৈরি করুন"
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

					<div>
						<label
							htmlFor="confirm-password"
							className="mb-2 block text-sm font-bold text-slate-700"
						>
							পাসওয়ার্ড নিশ্চিত করুন
						</label>
						<div className="relative">
							<LockKeyhole
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
								aria-hidden="true"
							/>
							<input
								id="confirm-password"
								name="confirmPassword"
								aria-invalid={errorField === "confirmPassword"}
								aria-describedby={
									errorField === "confirmPassword" ? "form-error" : undefined
								}
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
								value={confirmPassword}								onChange={(event) => {
									setConfirmPassword(event.target.value);
									clearError();
								}}
								placeholder="পাসওয়ার্ডটি আবার লিখুন"
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
								aria-label={showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
							>
								{showConfirmPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>

					{error && (
						<p
							id="form-error"
							className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
							role="alert"
						>
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="h-14 w-full rounded-2xl bg-secondary text-sm font-extrabold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
					</button>
				</form>

				{onLogin && (
					<p className="mt-6 text-center text-sm text-slate-500">
						অ্যাকাউন্ট আছে?{" "}
						<button
							type="button"
							onClick={onLogin}
							className="bg-gradient-to-r from-secondary to-secondary-dark bg-clip-text font-extrabold text-transparent transition hover:from-secondary/80 hover:to-secondary-dark/80 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:ring-offset-2"
						>
							লগইন করুন
						</button>
					</p>
				)}
			</div>
		</section>
	);
}
