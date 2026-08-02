import { Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Phone, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignIn() {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(false);

		if (!BANGLADESHI_MOBILE.test(phone)) {
			setError("Enter a valid 11-digit Bangladeshi mobile number.");
			return;
		}

		if (password.length < 8) {
			setError("Your password must be at least 8 characters.");
			return;
		}

		setError("");
		setSubmitted(true);
	};

	const handlePhoneChange = (value: string) => {
		setPhone(value.replace(/\D/g, "").slice(0, 11));
		setError("");
		setSubmitted(false);
	};

	return (
		<section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
			<div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
			<div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full bg-teal-100/50 blur-3xl" />

			<div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_24px_80px_rgba(15,53,42,0.14)] backdrop-blur-sm lg:grid-cols-[0.92fr_1.08fr]">
				<div className="relative hidden overflow-hidden bg-[#0d5e46] p-10 text-white lg:flex lg:flex-col lg:justify-between">
					<div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[34px] border-emerald-300/10" />
					<div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[42px] border-teal-200/10" />

					<div className="relative">
						<div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
							<ShieldCheck className="h-6 w-6" aria-hidden="true" />
						</div>
						<p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-100">
							CourierByte
						</p>
						<h1 className="max-w-sm text-4xl font-extrabold leading-tight tracking-tight">
							Your delivery data, right where you need it.
						</h1>
						<p className="mt-5 max-w-sm text-sm leading-7 text-emerald-50/75">
							Sign in to search shipments, view reports, and keep your courier
							workflow moving.
						</p>
					</div>

					<div className="relative flex items-center gap-3 text-sm text-emerald-50/75">
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
							<LockKeyhole className="h-4 w-4" aria-hidden="true" />
						</span>
						Secure access for your account
					</div>
				</div>

				<div className="p-6 sm:p-10 lg:p-14">
					<div className="mb-9">
						<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 lg:hidden">
							<ShieldCheck className="h-5 w-5" aria-hidden="true" />
						</div>
						<p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
							Welcome back
						</p>
						<h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
							Sign in to your account
						</h2>
						<p className="mt-3 text-sm leading-6 text-slate-500">
							Use your Bangladeshi mobile number to continue.
						</p>
					</div>

					<form className="space-y-5" onSubmit={handleSubmit} noValidate>
						<div>
							<label
								htmlFor="phone"
								className="mb-2 block text-sm font-bold text-slate-700"
							>
								Mobile number
							</label>
							<div className="relative">
								<Phone
									className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
									aria-hidden="true"
								/>
								<span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 border-r border-slate-200 pr-3 text-sm font-bold text-slate-500">
									+880
								</span>
								<input
									id="phone"
									name="phone"
									aria-invalid={Boolean(error && !BANGLADESHI_MOBILE.test(phone))}
									aria-describedby="phone-hint"
									type="tel"
									inputMode="numeric"
									autoComplete="tel-national"
									value={phone}
									onChange={(event) => handlePhoneChange(event.target.value)}
									placeholder="01XXXXXXXXX"
									pattern="01[3-9][0-9]{8}"
									required
									className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-[6.25rem] pr-4 text-base font-semibold tracking-wide text-slate-900 outline-none transition duration-200 placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
								/>
							</div>
							<p id="phone-hint" className="mt-2 text-xs text-slate-400">
								Example: 01712345678
							</p>
						</div>

						<div>
							<div className="mb-2 flex items-center justify-between gap-3">
								<label htmlFor="password" className="text-sm font-bold text-slate-700">
									Password
								</label>
								<span id="password-hint" className="text-xs font-medium text-slate-400">
									8+ characters
								</span>
							</div>
							<div className="relative">
								<LockKeyhole
									className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
									aria-hidden="true"
								/>
								<input
									id="password"
									name="password"
									aria-invalid={Boolean(error && BANGLADESHI_MOBILE.test(phone))}
									aria-describedby="password-hint"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									value={password}
									onChange={(event) => {
										setPassword(event.target.value);
										setError("");
										setSubmitted(false);
									}}
									placeholder="Enter your password"
									minLength={8}
									required
									className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base font-semibold text-slate-900 outline-none transition duration-200 placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((visible) => !visible)}
									className="absolute right-3 top-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" aria-hidden="true" />
									) : (
										<Eye className="h-5 w-5" aria-hidden="true" />
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

						{submitted && (
							<p
								className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
								role="status"
						>
								Your details look good. You’re ready to sign in.
							</p>
						)}

						<button
							type="submit"
							className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/20 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl hover:shadow-emerald-700/25 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
						>
							Sign in
							<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
						</button>
					</form>

					<div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-slate-500">
						<span>Want to learn more?</span>
						<Link
							to="/"
							className="font-bold text-emerald-700 transition hover:text-emerald-900"
						>
							Back to CourierByte
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
