// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import {
	CheckCircle2,
	Eye,
	EyeOff,
	LockKeyhole,
	Phone,
	Save,
	UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/userContext";
import { updateUser } from "@/server/functions/auth.fn";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export const Route = createFileRoute("/panel/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isLoading, refreshUser } = useAuth();
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!user) return;
		setName(user.name ?? "");
		setNumber(user.number ?? "");
	}, [user]);

	const clearMessages = () => {
		setError("");
		setSuccess("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearMessages();

		const trimmedName = name.trim();
		const trimmedNumber = number.trim();
		const userId = user?._id?.toString?.() ?? user?.id?.toString?.();

		if (!userId) {
			setError("আপনার অ্যাকাউন্টের তথ্য পাওয়া যায়নি। পরে আবার চেষ্টা করুন।");
			return;
		}
		if (!trimmedName) {
			setError("আপনার নাম লিখুন।");
			return;
		}
		if (!BANGLADESHI_MOBILE.test(trimmedNumber)) {
			setError("সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন।");
			return;
		}
		if (password && password.length < 6) {
			setError("নতুন পাসওয়ার্ডে কমপক্ষে ৬টি অক্ষর থাকতে হবে।");
			return;
		}
		if (password !== confirmPassword) {
			setError("নতুন পাসওয়ার্ড দুটি এক নয়।");
			return;
		}

		setIsSubmitting(true);
		try {
			await updateUser({
				data: {
					userId,
					name: trimmedName,
					number: trimmedNumber,
					...(password ? { password } : {}),
				},
			});
			await refreshUser();
			setPassword("");
			setConfirmPassword("");
			setSuccess("আপনার তথ্য সফলভাবে আপডেট হয়েছে।");
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "তথ্য আপডেট করা যায়নি। পরে আবার চেষ্টা করুন।",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<main className="flex min-h-[32rem] items-center justify-center p-6">
				<p className="text-sm font-semibold text-slate-500">তথ্য লোড হচ্ছে...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-secondary/70">
						Account settings
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark sm:text-4xl">
						প্রোফাইল আপডেট করুন
					</h1>
					<p className="mt-2 text-slate-500">
						আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন।
					</p>
				</div>

				<div className="overflow-hidden rounded-3xl border border-secondary/10 bg-white shadow-xl shadow-secondary/10">
					<div className="flex items-center gap-4 border-b border-secondary/10 bg-secondary/[0.04] px-6 py-5 sm:px-8">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
							<UserRound className="h-6 w-6" aria-hidden="true" />
						</div>
						<div>
							<h2 className="text-lg font-extrabold text-secondary-dark">
								অ্যাকাউন্টের তথ্য
							</h2>
							<p className="text-sm text-slate-500">
								নাম ও মোবাইল নাম্বার আপডেট করুন
							</p>
						</div>
					</div>

					<form className="space-y-6 p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
						<div className="grid gap-6 sm:grid-cols-2">
							<div>
								<label
									htmlFor="profile-name"
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
										id="profile-name"
										name="name"
										type="text"
										autoComplete="name"
										value={name}
										onChange={(event) => {
											setName(event.target.value);
											clearMessages();
										}}
										placeholder="আপনার পুরো নাম লিখুন"
										className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="profile-number"
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
										id="profile-number"
										name="number"
										type="tel"
										inputMode="numeric"
										autoComplete="tel-national"
										value={number}
										onChange={(event) => {
											setNumber(event.target.value.replace(/\D/g, "").slice(0, 11));
											clearMessages();
										}}
										placeholder="01XXXXXXXXX"
										className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
									/>
								</div>
							</div>
						</div>

						<div className="border-t border-secondary/10 pt-6">
							<div className="mb-4">
								<h2 className="font-extrabold text-secondary-dark">পাসওয়ার্ড পরিবর্তন</h2>
								<p className="mt-1 text-sm text-slate-500">
									পাসওয়ার্ড পরিবর্তন না করতে চাইলে এই ঘরগুলো খালি রাখুন।
								</p>
							</div>

							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<label
										htmlFor="new-password"
										className="mb-2 block text-sm font-bold text-slate-700"
									>
										নতুন পাসওয়ার্ড
									</label>
									<div className="relative">
										<LockKeyhole
											className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
											aria-hidden="true"
										/>
										<input
											id="new-password"
											name="password"
											type={showPassword ? "text" : "password"}
											autoComplete="new-password"
											value={password}
											onChange={(event) => {
												setPassword(event.target.value);
												clearMessages();
											}}
											placeholder="কমপক্ষে ৬টি অক্ষর"
											className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((visible) => !visible)}
											className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-secondary/10 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
											aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
										>
											{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>
								</div>

								<div>
									<label
										htmlFor="confirm-password"
										className="mb-2 block text-sm font-bold text-slate-700"
									>
										নতুন পাসওয়ার্ড নিশ্চিত করুন
									</label>
									<div className="relative">
										<LockKeyhole
											className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
											aria-hidden="true"
										/>
										<input
											id="confirm-password"
											name="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											autoComplete="new-password"
											value={confirmPassword}
											onChange={(event) => {
												setConfirmPassword(event.target.value);
												clearMessages();
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
											{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>
								</div>
							</div>
						</div>

						{error && (
							<p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700" role="alert">
								{error}
							</p>
						)}

						{success && (
							<p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
								<CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
								{success}
							</p>
						)}

						<button
							type="submit"
							disabled={isSubmitting || !user}
							className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-secondary text-sm font-extrabold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<Save className="h-5 w-5" aria-hidden="true" />
							{isSubmitting ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
