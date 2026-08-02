import { Eye, EyeOff, LockKeyhole, Phone, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";

const BANGLADESHI_MOBILE = /^01[3-9]\d{8}$/;

export default function SignUp() {
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
	const [submitted, setSubmitted] = useState(false);

	const showError = (
		field: "name" | "number" | "password" | "confirmPassword",
		message: string,
	) => {
		setError(message);
		setErrorField(field);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(false);

		if (!name.trim()) {
			showError("name", "Enter your name.");
			return;
		}

		if (!BANGLADESHI_MOBILE.test(number)) {
			showError("number", "Enter a valid 11-digit Bangladeshi mobile number.");
			return;
		}

		if (password.length < 8) {
			showError("password", "Your password must be at least 8 characters.");
			return;
		}

		if (password !== confirmPassword) {
			showError("confirmPassword", "Passwords do not match.");
			return;
		}

		setError("");
		setErrorField(null);
		setSubmitted(true);
	};

	const clearFeedback = () => {
		setError("");
		setErrorField(null);
		setSubmitted(false);
	};

	return (
		<section className="flex min-h-[38rem] items-center justify-center px-4 py-12 sm:px-6">
			<div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,53,42,0.1)] sm:p-9">
				<div className="mb-8">
					<p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
						Get started
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
						Create your account
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Enter your details to get started with CourierByte.
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit} noValidate>
					<div>
						<label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-700">
							Full name
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
								aria-describedby={errorField === "name" ? "form-error" : undefined}
								type="text"
								autoComplete="name"
								value={name}
								onChange={(event) => {
									setName(event.target.value);
									clearFeedback();
								}}
								placeholder="Enter your full name"
								required
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="number" className="mb-2 block text-sm font-bold text-slate-700">
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
								id="number"
								name="number"
								aria-invalid={errorField === "number"}
								aria-describedby={errorField === "number" ? "number-hint form-error" : "number-hint"}
								type="tel"
								inputMode="numeric"
								autoComplete="tel-national"
								value={number}
								onChange={(event) => {
									setNumber(event.target.value.replace(/\D/g, "").slice(0, 11));
									clearFeedback();
								}}
								placeholder="01XXXXXXXXX"
								pattern="01[3-9][0-9]{8}"
								required
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-[6.25rem] pr-4 text-base font-semibold tracking-wide text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
							/>
						</div>
						<p id="number-hint" className="mt-2 text-xs text-slate-400">
							Example: 01712345678
						</p>
					</div>

					<div>
						<label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">
							Password
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
								aria-describedby={errorField === "password" ? "form-error" : undefined}
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									clearFeedback();
								}}
								placeholder="Create a password"
								minLength={8}
								required
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
							</button>
						</div>
					</div>

					<div>
						<label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-slate-700">
							Confirm password
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
								aria-describedby={errorField === "confirmPassword" ? "form-error" : undefined}
								type={showConfirmPassword ? "text" : "password"}
								autoComplete="new-password"
								value={confirmPassword}
								onChange={(event) => {
									setConfirmPassword(event.target.value);
									clearFeedback();
								}}
								placeholder="Re-enter your password"
								required
								className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword((visible) => !visible)}
								className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
								aria-label={showConfirmPassword ? "Hide password" : "Show password"}
							>
								{showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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

					{submitted && (
						<p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
							Your details look good. You’re ready to create an account.
						</p>
					)}

					<button
						type="submit"
						className="h-14 w-full rounded-2xl bg-emerald-700 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
					>
						Create account
					</button>
				</form>
			</div>
		</section>
	);
}
