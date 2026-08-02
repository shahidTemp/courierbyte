import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowRight,
	BadgeCheck,
	BarChart3,
	Check,
	CheckCircle2,
	ChevronDown,
	CircleDollarSign,
	Crown,
	Gauge,
	Lock,
	PackageSearch,
	RefreshCw,
	Search,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	Target,
	TrendingDown,
	TrendingUp,
	Truck,
	WalletCards,
	XCircle,
	Zap,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

export const Route = createFileRoute("/_website/")({ component: Home });

const bn = (value: number) => value.toLocaleString("bn-BD");
const freeSearchDots = ["১", "২", "৩", "৪", "৫"];

/* ------------------------------------------------------------------ */
/* Product dashboard mockup                                            */
/* ------------------------------------------------------------------ */

const courierRows = [
	{ name: "পাথাও", count: "১৪টি", delivered: "১২", rate: 86, tone: "emerald" },
	{ name: "স্টেডফাস্ট", count: "৯টি", delivered: "৮", rate: 89, tone: "teal" },
	{ name: "RedX", count: "৭টি", delivered: "৪", rate: 57, tone: "amber" },
];

function MiniDashboard({ large = false }: { large?: boolean }) {
	return (
		<div className={`relative ${large ? "w-full" : "w-full max-w-[550px]"}`}>
			<div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-2xl" />
			<div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#102a25] shadow-[0_30px_80px_rgba(6,48,37,0.28)]">
				<div className="flex items-center justify-between border-b border-white/10 bg-[#0c211d] px-4 py-3 sm:px-5">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
							<PackageSearch className="h-4 w-4" />
						</span>
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300/60">
								CourierByte
							</p>
							<p className="text-xs font-semibold text-white">কাস্টমার ইনসাইট</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 sm:flex">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
							data preview
						</span>
						<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
							AR
						</span>
					</div>
				</div>

				<div className="space-y-4 p-4 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-[10px] font-medium text-slate-400">
								সার্চ করা নাম্বার
							</p>
							<p className="mt-1 text-sm font-bold tracking-wide text-white">
								017•••••••21
							</p>
						</div>
						<span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
							<BadgeCheck className="h-3.5 w-3.5" /> যাচাই করা হয়েছে
						</span>
					</div>

					<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
						<div className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
							<p className="text-[10px] text-slate-400">মোট পার্সেল</p>
							<p className="mt-1 text-xl font-extrabold text-white">৩০</p>
							<p className="mt-1 text-[9px] font-medium text-slate-500">
								সব কুরিয়ার
							</p>
						</div>
						<div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-3">
							<p className="text-[10px] text-emerald-200/70">রিসিভ করেছে</p>
							<p className="mt-1 text-xl font-extrabold text-emerald-300">২৪</p>
							<p className="mt-1 text-[9px] font-medium text-emerald-200/50">
								সফল ডেলিভারি
							</p>
						</div>
						<div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3">
							<p className="text-[10px] text-rose-200/70">ক্যানসেল</p>
							<p className="mt-1 text-xl font-extrabold text-rose-300">৬</p>
							<p className="mt-1 text-[9px] font-medium text-rose-200/50">
								রিফিউজ / রিটার্ন
							</p>
						</div>
						<div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.08] p-3">
							<p className="text-[10px] text-amber-200/70">রিস্ক স্কোর</p>
							<p className="mt-1 text-xl font-extrabold text-amber-300">মাঝারি</p>
							<p className="mt-1 text-[9px] font-medium text-amber-200/50">
								সতর্ক থাকুন
							</p>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
						<div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
							<div className="mb-4 flex items-center justify-between">
								<p className="text-xs font-bold text-white">
									কুরিয়ারভিত্তিক হিস্ট্রি
								</p>
								<span className="text-[10px] text-slate-500">Last 90 days</span>
							</div>
							<div className="space-y-3.5">
								{courierRows.map((row) => (
									<div key={row.name}>
										<div className="mb-1.5 flex items-center justify-between text-[10px]">
											<span className="flex items-center gap-1.5 font-semibold text-slate-300">
												<Truck className="h-3.5 w-3.5 text-emerald-400" />{" "}
												{row.name}
												<span className="font-normal text-slate-500">
													{row.count}
												</span>
											</span>
											<span className="font-bold text-slate-300">
												{row.delivered}/{row.count.replace("টি", "")} —{" "}
												{row.rate}%
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
											<div
												className={`h-full rounded-full ${
													row.tone === "amber"
														? "bg-amber-400"
														: "bg-emerald-400"
												}`}
												style={{ width: `${row.rate}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-between rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.12] to-orange-400/[0.06] p-4">
							<div>
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold text-white">সিদ্ধান্তের ইঙ্গিত</p>
									<ShieldAlert className="h-4 w-4 text-amber-300" />
								</div>
								<p className="mt-3 text-xs leading-relaxed text-amber-100/80">
									এই কাস্টমারের রিস্ক মাঝারি। COD পাঠালে কনফার্মেশন কল করুন।
								</p>
							</div>
							<div className="mt-5 flex items-end justify-between gap-3">
								<div>
									{" "}
									<p className="text-[10px] text-amber-200/60">
										সম্ভাব্য সাশ্রয় <span className="font-normal">(উদাহরণ)</span>
									</p>
									<p className="mt-1 text-xl font-extrabold text-white">
										৳ ১,৮০০
									</p>
								</div>
								<span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
									<WalletCards className="h-5 w-5" />
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3">
						<div className="flex items-center gap-2.5">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300">
								<Zap className="h-3.5 w-3.5" />
							</span>
							<p className="text-[10px] font-semibold text-emerald-100/80">
								রিপোর্ট তৈরি হয়েছে ০.৮ সেকেন্ডে
							</p>
						</div>
						<span className="text-[10px] font-bold text-emerald-300">
							নিরাপদ ও গোপনীয়
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Freemium search                                                     */
/* ------------------------------------------------------------------ */

function SearchDemo() {
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

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden bg-[#f4faf6]">
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -left-40 -top-52 h-[34rem] w-[34rem] rounded-full bg-emerald-200/40 blur-3xl" />
				<div className="absolute -right-48 top-20 h-[30rem] w-[30rem] rounded-full bg-teal-100/70 blur-3xl" />
				<div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,107,77,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,107,77,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
			</div>

			<div className="maxw relative z-10 px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20 lg:px-8 lg:pt-24">
				<div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
					<div className="max-w-xl">
						<h1 className="text-4xl font-extrabold leading-[1.14] tracking-tight text-[#102d27] sm:text-5xl lg:text-[3.65rem]">
							পণ্য পাঠানোর আগে কাস্টমার{" "}
							<span className="gradient-text">বিশ্বস্ত কিনা যাচাই করুন</span>
						</h1>
						<p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
							পার্সেল পাঠানোর আগে কাস্টমারের কুরিয়ার হিস্ট্রি দেখে নিন। রিসিভ রেট কম হলে
							আগে থেকেই সতর্ক হোন, কুরিয়ার খরচ বাঁচান, লাভ ধরে রাখুন।
						</p>
						<div className="mt-9">
							<SearchDemo />
						</div>
						<div className="mt-5 flex items-center gap-3 text-xs font-medium text-slate-500">
							<div className="flex -space-x-2">
								{[
									"bg-emerald-600",
									"bg-teal-600",
									"bg-amber-500",
									"bg-slate-700",
								].map((color, index) => (
									<span
										key={color}
										className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f4faf6] ${color} text-[9px] font-bold text-white`}
									>
										{["RA", "SH", "MK", "+"][index]}
									</span>
								))}
							</div>{" "}
							<span>
								<strong className="text-slate-700">UI preview</strong> ·
								verified users-এর সংখ্যা launch-এর পরে আপডেট হবে
							</span>
						</div>
					</div>

					<MiniDashboard large />
				</div>

				<div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-100 sm:grid-cols-4">
					{[
						{ value: "৫টি", label: "প্রতিদিন ফ্রি সার্চ" },
						{ value: "৫০+", label: "কুরিয়ার ডেটা" },
						{ value: "১ সেকেন্ড", label: "রিপোর্ট টাইম" },
						{ value: "৳১,৮০০+", label: "সম্ভাব্য সাশ্রয় (উদাহরণ)" },
					].map((item) => (
						<div
							key={item.label}
							className="bg-white/80 px-4 py-5 text-center backdrop-blur sm:px-6"
						>
							<p className="text-2xl font-extrabold text-[#102d27]">
								{item.value}
							</p>
							<p className="mt-1 text-xs font-medium text-slate-500">
								{item.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Business outcome                                                    */
/* ------------------------------------------------------------------ */

function BusinessOutcome() {
	return (
		<section className="section-pad bg-[#102d27] text-white">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
							আপনার লাভের হিসাব
						</p>
						<h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
							কুরিয়ার ফি কমলেই লাভ বাড়ে — হিসাবটা এতই সহজ
						</h2>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-emerald-50/65">
							একজন কাস্টমার পার্সেল না নিলে পণ্যের লাভ তো যায়ই, সঙ্গে যোগ হয় ডেলিভারি ও
							রিটার্ন চার্জ। কুরিয়ারবাইট সেই সিদ্ধান্তটা অর্ডার পাঠানোর আগেই সহজ করে।
						</p>
						<a
							href="#pricing"
							className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#0f6b4d] transition hover:-translate-y-0.5 hover:bg-emerald-50"
						>
							কোন প্যাকেজ আমার জন্য? <ArrowRight className="h-4 w-4" />
						</a>
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						<div className="rounded-2xl border border-rose-300/15 bg-rose-300/[0.07] p-5">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-rose-200/70">
									চেক না করলে (উদাহরণ)
								</span>
								<TrendingDown className="h-4 w-4 text-rose-300" />
							</div>
							<p className="mt-4 text-3xl font-extrabold text-white">-৳ ৩৫০</p>
							<p className="mt-2 text-xs leading-relaxed text-rose-100/55">
								প্রতি রিটার্নে পণ্য পাঠানো, ডেলিভারি ও রিটার্ন খরচ
							</p>
						</div>
						<div className="flex items-center justify-center sm:-mx-1">
							<ArrowRight className="hidden h-5 w-5 text-emerald-300 sm:block" />
							<ArrowDownRight className="h-5 w-5 text-emerald-300 sm:hidden" />
						</div>
						<div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.09] p-5">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-emerald-200/80">
									চেক করলে (উদাহরণ)
								</span>
								<TrendingUp className="h-4 w-4 text-emerald-300" />
							</div>
							<p className="mt-4 text-3xl font-extrabold text-emerald-300">
								+৳ ৩৫০
							</p>
							<p className="mt-2 text-xs leading-relaxed text-emerald-100/60">
								ঝুঁকিপূর্ণ অর্ডার আগে বুঝে, সঠিক কাস্টমারে ফোকাস
							</p>
						</div>
					</div>
				</div>
				<div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
					{[
						{
							icon: CircleDollarSign,
							title: "রিটার্ন খরচ কমে",
							desc: "প্রতিটি এড়ানো রিটার্ন সরাসরি আপনার লাভে যোগ হয়",
						},
						{
							icon: Target,
							title: "সঠিক কাস্টমারে ফোকাস",
							desc: "ডেটা দেখে অর্ডার কনফার্মেশন ও COD সিদ্ধান্ত নিন",
						},
						{
							icon: RefreshCw,
							title: "বিক্রির গতি বাড়ে",
							desc: "কম রিটার্ন, কম সময় নষ্ট — বেশি অর্ডার সামলান",
						},
					].map((item) => {
						const Icon = item.icon;
						return (
							<div key={item.title} className="flex gap-3">
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
									<Icon className="h-4 w-4" />
								</span>
								<div>
									<p className="text-sm font-bold text-white">{item.title}</p>
									<p className="mt-1 text-xs leading-relaxed text-emerald-50/55">
										{item.desc}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const steps = [
	{
		number: "০১",
		icon: Search,
		title: "অর্ডার আসলেই নাম্বার দিন",
		desc: "কাস্টমারের মোবাইল নাম্বারটি লিখুন। কোনো রেজিস্ট্রেশন ছাড়াই প্রথম ৫টি সার্চ ফ্রি।",
	},
	{
		number: "০২",
		icon: BarChart3,
		title: "রিপোর্টে ঝুঁকি বুঝুন",
		desc: "ডেলিভারি, ক্যানসেল, কুরিয়ারভিত্তিক ইতিহাস ও সাকসেস রেশিও এক স্ক্রিনে দেখুন।",
	},
	{
		number: "০৩",
		icon: ShieldCheck,
		title: "লাভের সিদ্ধান্ত নিন",
		desc: "COD পাঠাবেন, কনফার্মেশন কল করবেন নাকি অগ্রিম নেবেন — ডেটা দেখে ঠিক করুন।",
	},
];

function HowItWorks() {
	return (
		<section id="how" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
						সহজ workflow
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						অর্ডার থেকে সিদ্ধান্ত — এক মিনিটেরও কম সময়ে
					</h2>
					<p className="mt-4 text-lg leading-relaxed text-slate-600">
						আপনার টিমকে অনুমান করে নয়, তথ্য দেখে সিদ্ধান্ত নেওয়ার অভ্যাস দিন।
					</p>
				</div>
				<div className="relative mt-12 grid gap-5 md:grid-cols-3">
					<div
						aria-hidden
						className="absolute left-[16%] right-[16%] top-9 hidden border-t border-dashed border-emerald-200 md:block"
					/>
					{steps.map((step) => {
						const Icon = step.icon;
						return (
							<div
								key={step.number}
								className="relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
							>
								<div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
									<Icon className="h-7 w-7" />
									<span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0f6b4d] text-[10px] font-extrabold text-white ring-4 ring-white">
										{step.number}
									</span>
								</div>
								<h3 className="mt-6 text-lg font-extrabold text-slate-900">
									{step.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-500">
									{step.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Feature showcase                                                    */
/* ------------------------------------------------------------------ */

const valueFeatures = [
	{
		icon: PackageSearch,
		tag: "01 · ঝুঁকি বোঝা",
		title: "প্রতিটি কাস্টমারের জন্য একটি পরিষ্কার উত্তর",
		desc: "শুধু ‘ভালো’ বা ‘খারাপ’ নয় — কোন কুরিয়ারে কতবার নিয়েছে, কতবার রিসিভ করেছে, কোথায় সমস্যা হয়েছে সব দেখুন।",
		points: [
			"মোট অর্ডার বনাম সফল ডেলিভারি",
			"ক্যানসেল ও রিটার্নের ইতিহাস",
			"সহজ Risk level ও action hint",
		],
	},
	{
		icon: WalletCards,
		tag: "02 · লাভ রক্ষা",
		title: "রিপোর্ট শুধু তথ্য নয় — টাকার সিদ্ধান্ত",
		desc: "একটি রিটার্নে কত খরচ হতে পারে, সেই হিসাব মাথায় রেখেই আপনার টিমকে পরবর্তী পদক্ষেপ বুঝিয়ে দিন।",
		points: [
			"সম্ভাব্য লোকসানের ইঙ্গিত",
			"সাকসেস রেশিও দেখে COD সিদ্ধান্ত",
			"অর্ডার কনফার্মেশন workflow",
		],
	},
];

function SavingsBoard() {
	return (
		<div className="relative w-full max-w-[550px]">
			<div className="absolute -inset-5 rounded-[2rem] bg-amber-200/50 blur-2xl" />
			<div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,53,42,0.14)] sm:p-6">
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
							<WalletCards className="h-5 w-5" />
						</span>
						<div>
							<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
								Business impact
							</p>
							<p className="mt-1 text-sm font-extrabold text-slate-900">
								লাভের হিসাব
							</p>
						</div>
					</div>
					<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
						UI preview
					</span>
				</div>
				<div className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-xl bg-slate-50 p-4">
						<p className="text-[10px] font-semibold text-slate-400">
							চেক না করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-rose-500">-৳ ৩৫০</p>
						<p className="mt-1 text-[10px] text-slate-500">সম্ভাব্য রিটার্ন খরচ</p>
					</div>
					<div className="rounded-xl bg-emerald-50 p-4">
						<p className="text-[10px] font-semibold text-emerald-700/60">
							চেক করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-emerald-700">
							+৳ ৩৫০
						</p>
						<p className="mt-1 text-[10px] text-emerald-700/60">লাভ রক্ষার সুযোগ</p>
					</div>
				</div>
				<div className="mt-5 rounded-xl border border-slate-100 p-4">
					<div className="flex items-center justify-between">
						<p className="text-xs font-extrabold text-slate-800">
							মাসিক রিটার্ন কমানোর সম্ভাবনা
						</p>
						<TrendingDown className="h-4 w-4 text-emerald-600" />
					</div>
					<div className="mt-5 flex h-28 items-end gap-2 sm:gap-3">
						{[
							{ day: "শনি", height: 42 },
							{ day: "রবি", height: 58 },
							{ day: "সোম", height: 47 },
							{ day: "মঙ্গল", height: 72 },
							{ day: "বুধ", height: 66 },
							{ day: "বৃহঃ", height: 88 },
							{ day: "শুক্র", height: 79 },
						].map((bar) => (
							<div
								key={bar.day}
								className="flex flex-1 flex-col items-center gap-2"
							>
								<div
									className={`w-full rounded-t-md ${bar.day === "শুক্র" ? "bg-emerald-500" : "bg-emerald-100"}`}
									style={{ height: `${bar.height}%` }}
								/>
								<span className="text-[9px] font-medium text-slate-400">
									{bar.day}
								</span>
							</div>
						))}
					</div>
				</div>
				<div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-[11px] font-bold text-emerald-800">
					<Target className="h-4 w-4 shrink-0 text-emerald-600" /> প্রতিটি সঠিক
					সিদ্ধান্ত আপনার margin রক্ষা করে
				</div>
			</div>
		</div>
	);
}

function FeatureShowcase() {
	return (
		<section id="features" className="section-pad bg-[#f4faf6]">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
						আপনার ব্যবসায় বাস্তব প্রভাব
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						ফিচার দেখানোর জন্য নয়,
						<br className="hidden sm:block" /> সিদ্ধান্ত বদলানোর জন্য তৈরি
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						একটি সুন্দর ড্যাশবোর্ডের পেছনে আছে আপনার সময়, পণ্য ও লাভ রক্ষার একটি নির্দিষ্ট
						workflow।
					</p>
				</div>
				<div className="mt-16 space-y-20">
					{valueFeatures.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.tag}
								className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
							>
								<div>
									<span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-sm ring-1 ring-emerald-100">
										<Icon className="h-3.5 w-3.5" /> {feature.tag}
									</span>
									<h3 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900">
										{feature.title}
									</h3>
									<p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
										{feature.desc}
									</p>
									<ul className="mt-7 space-y-3">
										{feature.points.map((point) => (
											<li
												key={point}
												className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"
											>
												<CheckCircle2 className="h-5 w-5 text-emerald-600" />{" "}
												{point}
											</li>
										))}
									</ul>
								</div>
								<div className="relative">
									{index === 0 ? <MiniDashboard /> : <SavingsBoard />}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Freemium model                                                      */
/* ------------------------------------------------------------------ */

function FreemiumSection() {
	return (
		<section id="free" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-white shadow-[0_24px_80px_rgba(15,107,77,0.12)]">
					<div className="grid lg:grid-cols-[1fr_0.9fr]">
						<div className="bg-gradient-to-br from-[#e7f7ee] to-white p-7 sm:p-10 lg:p-14">
							<span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/20">
								<Sparkles className="h-3.5 w-3.5" /> Free forever শুরু করুন
							</span>
							<h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
								আগে ব্যবহার করে দেখুন।
								<br />
								<span className="gradient-text">ভালো লাগলে তবেই আপগ্রেড করুন।</span>
							</h2>
							<p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
								প্রতিদিন ৫টি কাস্টমার চেক সম্পূর্ণ ফ্রি। কোনো কার্ড, কোনো commitment নেই।
								আপনার ব্যবসায় এটি কতটা কাজে লাগে, নিজেই বুঝে নিন।
							</p>
							<div className="mt-8 grid gap-3 sm:grid-cols-2">
								<div className="rounded-xl border border-emerald-100 bg-white p-4">
									<p className="text-2xl font-extrabold text-emerald-700">
										৫টি
									</p>
									<p className="mt-1 text-xs font-semibold text-slate-500">
										প্রতিদিন ফ্রি সার্চ
									</p>
								</div>
								<div className="rounded-xl border border-emerald-100 bg-white p-4">
									<p className="text-2xl font-extrabold text-emerald-700">৳০</p>
									<p className="mt-1 text-xs font-semibold text-slate-500">
										শুরু করতে খরচ
									</p>
								</div>
							</div>
						</div>
						<div className="bg-[#102d27] p-7 text-white sm:p-10 lg:p-14">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
										Free usage pass
									</p>
									<h3 className="mt-2 text-xl font-extrabold">আজকের ব্যবহার</h3>
								</div>
								<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300">
									<Gauge className="h-5 w-5" />
								</span>
							</div>
							<div className="mt-8 flex items-end justify-between">
								<div>
									<span className="text-5xl font-extrabold text-white">০</span>
									<span className="ml-2 text-sm font-medium text-emerald-100/50">
										/ ৫ সার্চ
									</span>
								</div>
								<span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
									আজ ফ্রি
								</span>
							</div>
							<div className="mt-5 flex gap-2">
								{freeSearchDots.map((dot) => (
									<div
										key={dot}
										className="h-2 flex-1 rounded-full bg-emerald-400"
									/>
								))}
							</div>
							<div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
								<div className="flex items-start gap-3">
									<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
										<Lock className="h-4 w-4" />
									</span>
									<div>
										<p className="text-sm font-bold text-white">
											৫টির বেশি সার্চ দরকার?
										</p>
										<p className="mt-1 text-xs leading-relaxed text-emerald-50/60">
											লগইন করে একটি প্যাকেজ নিলে আপনার পুরো টিম আরও বেশি কাস্টমার চেক
											করতে পারবে।
										</p>
									</div>
								</div>
							</div>
							<a
								href="#pricing"
								className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-extrabold text-[#102d27] transition hover:bg-emerald-300"
							>
								প্যাকেজগুলো দেখুন <ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const plans = [
	{
		name: "ফ্রি",
		kicker: "শুরু করে দেখুন",
		price: "৳০",
		period: "চিরতরে",
		description: "ব্যক্তিগতভাবে যাচাই করার জন্য",
		features: [
			"প্রতিদিন ৫টি সার্চ",
			"বেসিক কাস্টমার রিপোর্ট",
			"সাকসেস রেশিও",
			"ডেটা প্রাইভেসি",
		],
		cta: "ফ্রিতে শুরু করুন",
		popular: false,
	},
	{
		name: "গ্রো",
		kicker: "বেশি অর্ডার, বেশি নিয়ন্ত্রণ",
		price: "৳২৯৯",
		period: "/মাস",
		description: "নিয়মিত অর্ডার নেওয়া ব্যবসার জন্য",
		features: [
			"মাসে ৫০০টি সার্চ",
			"সম্পূর্ণ রিস্ক স্কোর",
			"কুরিয়ারভিত্তিক ব্রেকডাউন",
			"টিমের জন্য শেয়ারড অ্যাক্সেস",
			"প্রায়োরিটি সাপোর্ট",
		],
		cta: "গ্রো দিয়ে শুরু করুন",
		popular: true,
	},
	{
		name: "বিজনেস",
		kicker: "পুরো টিমের জন্য",
		price: "৳৯৯৯",
		period: "/মাস",
		description: "স্কেল করা ই-কমার্স অপারেশনের জন্য",
		features: [
			"আনলিমিটেড সার্চ",
			"API অ্যাক্সেস",
			"মাল্টি-ইউজার অ্যাকাউন্ট",
			"কাস্টম রিপোর্ট ও এক্সপোর্ট",
			"ডেডিকেটেড সাপোর্ট",
		],
		cta: "বিজনেস নিয়ে কথা বলুন",
		popular: false,
	},
];

function Pricing() {
	return (
		<section id="pricing" className="section-pad bg-[#f4faf6]">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
						আপনার গতির সাথে বাড়ুন
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						একটি ভুল অর্ডারের চেয়ে
						<br />
						একটি প্যাকেজের দাম কম
					</h2>{" "}
					<p className="mt-4 text-lg text-slate-600">
						আগে ৫টি সার্চ ফ্রি। যখন ব্যবসা বাড়বে, তখন আপনার প্রয়োজনের প্ল্যানে যান।
					</p>
					<p className="mt-3 text-xs font-semibold text-slate-500">
						নিচের মূল্য ও limitগুলো launch-এর আগের UI preview — আপনার final business
						pricing অনুযায়ী আপডেটযোগ্য।
					</p>
				</div>
				<div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-2xl ${plan.popular ? "border-emerald-500 shadow-xl shadow-emerald-900/10 ring-2 ring-emerald-500/20 lg:-translate-y-3" : "border-slate-200/80 shadow-sm"}`}
						>
							{plan.popular && (
								<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-4 py-1.5 text-[11px] font-extrabold text-white shadow-lg shadow-emerald-600/25">
									<Crown className="mr-1 inline h-3.5 w-3.5" /> সবচেয়ে জনপ্রিয়
								</span>
							)}
							<p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
								{plan.kicker}
							</p>
							<h3 className="mt-3 text-xl font-extrabold text-slate-900">
								{plan.name}
							</h3>
							<div className="mt-4 flex items-baseline gap-1">
								<span className="text-4xl font-extrabold tracking-tight text-slate-900">
									{plan.price}
								</span>
								<span className="text-sm font-semibold text-slate-400">
									{plan.period}
								</span>
							</div>
							<p className="mt-2 text-sm text-slate-500">{plan.description}</p>
							<div className="my-6 h-px bg-slate-100" />
							<ul className="flex-1 space-y-3.5">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="flex items-start gap-2.5 text-sm font-medium text-slate-600"
									>
										<Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{" "}
										{feature}
									</li>
								))}
							</ul>
							<Link
								to="/login"
								className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${plan.popular ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700" : "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"}`}
							>
								{plan.cta} <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					))}
				</div>
				<p className="mt-8 text-center text-xs font-medium text-slate-500">
					সব প্যাকেজে নিরাপদ ডেটা · কোনো hidden charge নেই · প্রয়োজনে যেকোনো সময়
					আপগ্রেড করুন
				</p>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* FAQ and CTA                                                         */
/* ------------------------------------------------------------------ */

const faqs = [
	{
		q: "প্রতিদিন ৫টি ফ্রি সার্চ কীভাবে কাজ করবে?",
		a: "প্রতিদিন প্রতিটি visitor পাঁচটি কাস্টমার নাম্বার কোনো খরচ ছাড়াই চেক করতে পারবেন। ফাংশনালিটি যুক্ত হলে অ্যাকাউন্ট ও usage tracking-এর মাধ্যমে এই সীমা নিয়ন্ত্রণ করা হবে।",
	},
	{
		q: "৫টি সার্চ শেষ হলে কী হবে?",
		a: "আপনি সেদিনের free limit শেষ করলে লগইন করে একটি প্যাকেজ বেছে নিতে পারবেন। প্যাকেজ নিলে আরও বেশি সার্চ, পূর্ণাঙ্গ রিপোর্ট ও team-oriented সুবিধা পাওয়া যাবে।",
	},
	{
		q: "ফ্রি প্ল্যানে কি কার্ড লাগবে?",
		a: "না। ফ্রি ব্যবহার শুরু করতে কোনো কার্ড বা পেমেন্ট লাগবে না। আগে ব্যবহার করে আপনার ব্যবসায়ের জন্য উপকারিতা বুঝে নিন।",
	},
	{
		q: "রিপোর্টে কী কী দেখা যাবে?",
		a: "মোট পার্সেল, সফল ডেলিভারি, ক্যানসেল/রিটার্ন, কুরিয়ারভিত্তিক ইতিহাস, সাকসেস রেশিও ও একটি সহজ risk/action hint দেখা যাবে।",
	},
];

function Faq() {
	const [open, setOpen] = useState(0);
	return (
		<section id="faq" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
							প্রশ্ন থাকতেই পারে
						</p>
						<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
							শুরু করার আগে
							<br />
							সবকিছু জেনে নিন
						</h2>
						<p className="mt-4 text-base leading-relaxed text-slate-600">
							ফ্রি দিয়ে শুরু করা, usage limit আর রিপোর্ট নিয়ে সাধারণ প্রশ্নগুলোর উত্তর
							এখানে।
						</p>
					</div>
					<div className="space-y-3">
						{faqs.map((faq, index) => {
							const isOpen = open === index;
							return (
								<div
									key={faq.q}
									className={`overflow-hidden rounded-2xl border bg-white transition-all ${isOpen ? "border-emerald-200 shadow-md" : "border-slate-200/80 shadow-sm"}`}
								>
									{" "}
									<button
										type="button"
										onClick={() => setOpen(isOpen ? -1 : index)}
										aria-expanded={isOpen}
										aria-controls={`faq-panel-${index}`}
										className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
									>
										<span className="text-sm font-extrabold text-slate-800">
											{faq.q}
										</span>
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
										>
											<ChevronDown
												className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
											/>
										</span>
									</button>{" "}
									<div
										id={`faq-panel-${index}`}
										className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
									>
										<div className="overflow-hidden">
											<p className="px-5 pb-5 text-sm leading-relaxed text-slate-500">
												{faq.a}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

function FinalCta() {
	return (
		<section id="contact" className="pb-20 sm:pb-28">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f6b4d] to-[#0b4032] px-6 py-14 text-center shadow-2xl shadow-emerald-900/20 sm:px-12">
					<div
						aria-hidden
						className="absolute -left-20 -top-32 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl"
					/>
					<div
						aria-hidden
						className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl"
					/>
					<div className="relative">
						<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-emerald-100">
							<Zap className="h-3.5 w-3.5" /> আজই আপনার প্রথম চেক করুন
						</span>
						<h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
							আপনার পরের COD অর্ডারটি
							<br />
							অনুমানের ওপর ছেড়ে দেবেন না
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-emerald-50/75">
							প্রতিদিনের ৫টি ফ্রি সার্চ দিয়ে শুরু করুন। কুরিয়ারবাইট আপনার লাভ রক্ষা করতে কতটা
							সাহায্য করে, নিজেই দেখুন।
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<a
								href="#hero"
								className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-[#0f6b4d] shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50"
							>
								<Search className="h-4 w-4" /> ফ্রি সার্চ শুরু করুন
							</a>
							<a
								href="#pricing"
								className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
							>
								প্যাকেজ দেখুন <ArrowRight className="h-4 w-4" />
							</a>
						</div>
						<p className="mt-5 text-xs font-medium text-emerald-100/55">
							কোনো কার্ড লাগবে না · কোনো commitment নেই
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function Home() {
	return (
		<div>
			<Hero />
			<BusinessOutcome />
			<HowItWorks />
			<FeatureShowcase />
			<FreemiumSection />
			<Pricing />
			<Faq />
			<FinalCta />
		</div>
	);
}
