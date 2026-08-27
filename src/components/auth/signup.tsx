// @ts-nocheck
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/userContext";
import { createUser } from "@/server/functions/auth.fn";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignUp({ onLogin }) {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [errorField, setErrorField] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const showError = (field, message) => {
		setError(message);
		setErrorField(field);
	};

	const clearError = () => {
		setError("");
		setErrorField(null);
	};

	const handleSubmit = async (event) => {
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
			await refreshUser();
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
			setError("প্যানেল খোলা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
			setIsSubmitting(false);
		}
	};

	return (
		<section className="relative isolate flex min-h-[42rem] items-center justify-center overflow-hidden bg-night px-4 py-14 sm:px-6">
			<div aria-hidden="true" className="pointer-events-none absolute -left-24 top-8 size-72 rounded-full bg-accent/10 blur-3xl" />
			<div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-secondary/20 blur-3xl" />
			<div className="relative w-full max-w-md rounded-3xl border border-accent/25 bg-accent/10 backdrop-blur-sm p-6 shadow-2xl shadow-black/20 sm:p-9">
				<div className="mb-8">
					{" "}
					<h1 className="text-3xl font-extrabold tracking-tight text-white/90">
						আপনার অ্যাকাউন্ট তৈরি করুন
					</h1>
					<p className="mt-2 text-sm text-white/65">
						কুরিয়ারবাইট ব্যবহার শুরু করতে নিচের তথ্যগুলো দিন। অ্যাডমিন অনুমোদনের পর অ্যাকাউন্ট
						সক্রিয় হবে।
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit} noValidate>
					<div>
						<label
							htmlFor="name"
							className="mb-2 block text-sm font-bold text-white/90"
						>
							পুরো নাম
						</label>
						<div className="relative">
							<UserRound
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/55"
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
								value={name}
								onChange={(event) => {
									setName(event.target.value);
									clearError();
								}}
								placeholder="আপনার পুরো নাম লিখুন"
								className="h-14 w-full rounded-2xl border border-accent/20 bg-white/10 pl-12 pr-4 text-base text-white outline-none transition focus:border-accent focus:bg-white/15 focus:ring-4 focus:ring-accent/10"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="number"
							className="mb-2 block text-sm font-bold text-white/90"
						>
							মোবাইল নাম্বার
						</label>
						<div className="relative">
							<Phone
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/55"
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
								value={number}
								onChange={(event) => {
									setNumber(event.target.value.replace(/\D/g, "").slice(0, 11));
									clearError();
								}}
								placeholder="01XXXXXXXXX"
								className="h-14 w-full rounded-2xl border border-accent/20 bg-white/10 pl-12 pr-4 text-base font-semibold tracking-wide text-white outline-none transition focus:border-accent focus:bg-white/15 focus:ring-4 focus:ring-accent/10"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-bold text-white/90"
						>
							পাসওয়ার্ড
						</label>
						<div className="relative">
							<LockKeyhole
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/55"
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
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									clearError();
								}}
								placeholder="একটি পাসওয়ার্ড তৈরি করুন"
								className="h-14 w-full rounded-2xl border border-accent/20 bg-white/10 pl-12 pr-12 text-base text-white outline-none transition focus:border-accent focus:bg-white/15 focus:ring-4 focus:ring-accent/10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/55 transition hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
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
							className="mb-2 block text-sm font-bold text-white/90"
						>
							পাসওয়ার্ড নিশ্চিত করুন
						</label>
						<div className="relative">
							<LockKeyhole
								className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/55"
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
								value={confirmPassword}
								onChange={(event) => {
									setConfirmPassword(event.target.value);
									clearError();
								}}
								placeholder="পাসওয়ার্ডটি আবার লিখুন"
								className="h-14 w-full rounded-2xl border border-accent/20 bg-white/10 pl-12 pr-12 text-base text-white outline-none transition focus:border-accent focus:bg-white/15 focus:ring-4 focus:ring-accent/10"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/55 transition hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
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
						className="h-14 w-full rounded-2xl bg-accent text-sm font-extrabold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
					</button>
				</form>

				{onLogin && (
					<p className="mt-6 text-center text-sm text-white/65">
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
