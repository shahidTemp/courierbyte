import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	BadgeCheck,
	BarChart3,
	CheckCircle2,
	ChevronDown,
	Clock,
	Database,
	Gauge,
	Headphones,
	Lock,
	Mail,
	MapPin,
	MessageCircle,
	Network,
	PackageSearch,
	Phone,
	Search,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	Truck,
	Users,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_website/")({ component: Home });

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const heroChips = [
	{
		icon: PackageSearch,
		label: "কুরিয়ার হিস্ট্রি",
		accent: "bg-emerald-100 text-emerald-700",
	},
	{
		icon: TrendingUp,
		label: "সাকসেস রেশিও",
		accent: "bg-teal-100 text-teal-700",
	},
	{ icon: Gauge, label: "রিস্ক স্কোর", accent: "bg-amber-100 text-amber-700" },
];

const heroStats = [
	{ value: "১,২০,০০০+", label: "পার্সেল হিস্ট্রি চেক" },
	{ value: "৫০+", label: "কুরিয়ার পার্টনার" },
	{ value: "৯৮.৫%", label: "গড় সাকসেস রেশিও" },
];

function PhoneSearch() {
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const digits = e.target.value.replace(/\D/g, "");
		setPhone(digits.slice(0, 11));
		setError("");
		setSubmitted(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!/^01[3-9]\d{8}$/.test(phone)) {
			setError("সঠিক ১১ সংখ্যার মোবাইল নাম্বার দিন (যেমন: 01XXXXXXXXX)");
			setSubmitted(false);
			return;
		}
		setError("");
		setSubmitted(true);
	};

	return (
		<div className="mx-auto w-full max-w-2xl">
			<form onSubmit={handleSubmit} className="relative">
				<div className="flex flex-col gap-3 rounded-2xl bg-white/95 p-2 shadow-2xl shadow-emerald-900/10 ring-1 ring-emerald-900/5 backdrop-blur sm:flex-row sm:items-center">
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
							className="w-full rounded-xl bg-slate-50 py-4 pl-[4.5rem] pr-4 text-lg font-semibold tracking-wider text-slate-800 outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
						/>
					</label>
					<button
						type="submit"
						className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/40 active:translate-y-0 active:scale-[0.98]"
					>
						<Search className="h-5 w-5 transition-transform group-hover:scale-110" />
						চেক করুন
					</button>
				</div>

				{error && (
					<p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-rose-600">
						<XCircle className="h-4 w-4" />
						{error}
					</p>
				)}

				{submitted && (
					<p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
						<Sparkles className="h-4 w-4" />
						রিপোর্ট দেখার ফিচারটি শীঘ্রই চালু হচ্ছে — সাথে থাকুন!
					</p>
				)}
			</form>

			<div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
				<span className="flex items-center gap-1.5">
					<ShieldCheck className="h-4 w-4 text-emerald-600" /> ১০০% কনফিডেনশিয়াল
				</span>
				<span className="flex items-center gap-1.5">
					<Zap className="h-4 w-4 text-emerald-600" /> ইনস্ট্যান্ট রেজাল্ট
				</span>
				<span className="flex items-center gap-1.5">
					<Lock className="h-4 w-4 text-emerald-600" /> ডেটা সম্পূর্ণ নিরাপদ
				</span>
			</div>
		</div>
	);
}

function ReportCardMock({ compact = false }: { compact?: boolean }) {
	const couriers = [
		{ name: "পাথাও", delivered: 12, cancelled: 2, total: 14, pct: 86 },
		{ name: "স্টেডফাস্ট", delivered: 8, cancelled: 1, total: 9, pct: 89 },
		{ name: "RedX", delivered: 4, cancelled: 3, total: 7, pct: 57 },
	];
	return (
		<div className="text-left">
			{/* Card header */}
			<div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
						<Phone className="h-5 w-5" />
					</span>
					<div>
						<p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
							কাস্টমার নাম্বার
						</p>
						<p className="text-sm font-bold text-slate-800">017XXXXXXX1</p>
					</div>
				</div>
				<span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
					<BadgeCheck className="h-3.5 w-3.5" /> ভেরিফায়েড
				</span>
			</div>

			{/* Stat grid */}
			<div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
				<div className="px-3 py-3 text-center">
					<p className="text-lg font-extrabold text-slate-800">৩০</p>
					<p className="text-[10px] font-semibold text-slate-400">মোট পার্সেল</p>
				</div>
				<div className="px-3 py-3 text-center">
					<p className="text-lg font-extrabold text-emerald-600">২৪</p>
					<p className="text-[10px] font-semibold text-slate-400">ডেলিভারি</p>
				</div>
				<div className="px-3 py-3 text-center">
					<p className="text-lg font-extrabold text-rose-500">৬</p>
					<p className="text-[10px] font-semibold text-slate-400">ক্যানসেল</p>
				</div>
				<div className="px-3 py-3 text-center">
					<p className="text-lg font-extrabold text-teal-600">৮০%</p>
					<p className="text-[10px] font-semibold text-slate-400">সাকসেস</p>
				</div>
			</div>

			{/* Couriers breakdown */}
			<div className="space-y-3 px-5 py-4">
				<p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
					কুরিয়ারভিত্তিক হিস্ট্রি
				</p>
				{couriers.map((c) => (
					<div key={c.name}>
						<div className="mb-1 flex items-center justify-between text-xs">
							<span className="font-semibold text-slate-600">
								<Truck className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
								{c.name}
							</span>
							<span className="font-bold text-slate-700">
								{c.delivered}/{c.total} — {c.pct}%
							</span>
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
							<div
								className={`h-full rounded-full ${
									c.pct >= 80
										? "bg-emerald-500"
										: c.pct >= 65
											? "bg-amber-500"
											: "bg-rose-500"
								}`}
								style={{ width: `${c.pct}%` }}
							/>
						</div>
					</div>
				))}
			</div>

			{/* Risk footer */}
			<div className="flex items-center justify-between rounded-b-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3.5 ring-1 ring-amber-100">
				<span className="flex items-center gap-2 text-xs font-bold text-amber-700">
					<ShieldAlert className="h-4 w-4" /> রিস্ক লেভেল
				</span>
				<span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
					মাঝারি ঝুঁকি
				</span>
			</div>

			{compact && (
				<div className="mt-4 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
					<p className="text-xs font-semibold text-emerald-800">
						💡 ৮০%-এর কম সাকসেস রেশিওর কাস্টমারকে COD পাঠানোর আগে সতর্ক হোন — কুরিয়ার ফি
						আপনাকেই বহন করতে হতে পারে।
					</p>
				</div>
			)}
		</div>
	);
}

function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden">
			{/* Animated blobs */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl animate-blob" />
				<div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-teal-300/40 blur-3xl animate-blob [animation-delay:2s]" />
				<div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl animate-blob [animation-delay:4s]" />
			</div>

			<div className="maxw relative z-10 px-4 pt-16 pb-24 sm:px-6 lg:px-8">
				<div className="text-center">
					{/* Trust badge */}
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
						<span className="relative flex h-2.5 w-2.5">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
						</span>
						<span className="text-sm font-semibold text-slate-600">
							🔥 ৫,০০০+ ই-কমার্স ব্যবসা আমাদের ব্যবহার করছে
						</span>
					</div>

					<h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
						পার্সেল পাঠানোর আগে{" "}
						<span className="gradient-text pb-1">কাস্টমারকে চিনে নিন</span>
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
						ক্যাশ অন ডেলিভারি পাঠানোর আগে মোবাইল নাম্বার দিয়ে চেক করুন — কাস্টমারের কুরিয়ার
						হিস্ট্রি, ডেলিভারি রেট আর সাকসেস রেশিও। এড়িয়ে যান অপ্রয়োজনীয় কুরিয়ার খরচ।
					</p>

					{/* Feature chips */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						{heroChips.map((chip) => (
							<div
								key={chip.label}
								className={`flex cursor-default items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${chip.accent}`}
							>
								<chip.icon className="h-4 w-4" />
								{chip.label}
							</div>
						))}
					</div>

					{/* Search */}
					<div className="mt-10 animate-fade-in-up">
						<PhoneSearch />
					</div>

					{/* Report mockup with floating cards */}
					<div className="relative mx-auto mt-20 max-w-xl">
						<div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-emerald-900/15 ring-1 ring-slate-100">
							<ReportCardMock />
						</div>

						{/* Floating stat cards */}
						<div
							className="absolute -right-3 -top-8 hidden animate-bounce rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-100 sm:block md:-right-10"
							style={{ animationDuration: "3s" }}
						>
							<div className="flex items-center gap-2.5">
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
									<TrendingUp className="h-5 w-5" />
								</span>
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
										সাকসেস রেশিও
									</p>
									<p className="text-sm font-extrabold text-slate-800">৮০%</p>
								</div>
							</div>
						</div>
						<div
							className="absolute -bottom-8 -left-3 hidden animate-bounce rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-100 sm:block md:-left-10"
							style={{ animationDuration: "4s" }}
						>
							<div className="flex items-center gap-2.5">
								<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
									<Zap className="h-5 w-5" />
								</span>
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
										রেজাল্ট টাইম
									</p>
									<p className="text-sm font-extrabold text-slate-800">
										&lt; ১ সেকেন্ড
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Stats */}
					<div className="mx-auto mt-24 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
						{heroStats.map((stat) => (
							<div
								key={stat.label}
								className="rounded-2xl border border-white/60 bg-white/60 px-6 py-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/80"
							>
								<p className="text-2xl font-extrabold text-slate-900 md:text-3xl">
									{stat.value}
								</p>
								<p className="mt-1 text-sm font-medium text-slate-500">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Courier marquee                                                     */
/* ------------------------------------------------------------------ */

const couriers = [
	"পাথাও",
	"স্টেডফাস্ট",
	"RedX",
	"সান্দারবান কুরিয়ার",
	"eCourier",
	"পেপারফ্লাই",
	"করতোয়া",
	"SA Paribahan",
	"এক্সপ্রেস",
	"আলফা",
];

function CourierMarquee() {
	const items = [0, 1].flatMap((dup) =>
		couriers.map((c) => ({ id: `${dup}-${c}`, name: c })),
	);
	return (
		<section className="border-y border-slate-100 bg-white/60 py-10 backdrop-blur">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
					বিশ্বস্ত কুরিয়ার পার্টনারদের হিস্ট্রি এক জায়গায়
				</p>
			</div>
			<div className="relative overflow-hidden">
				<div className="flex w-max animate-marquee items-center">
					{items.map((c) => (
						<div
							key={c.id}
							className="flex shrink-0 items-center gap-2 pr-10 text-slate-400 transition-colors hover:text-emerald-600"
						>
							<Truck className="h-5 w-5" />
							<span className="whitespace-nowrap text-lg font-bold">
								{c.name}
							</span>
						</div>
					))}
				</div>
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const steps = [
	{
		icon: Search,
		step: "০১",
		title: "মোবাইল নাম্বার দিন",
		desc: "কাস্টমারের ১১ সংখ্যার মোবাইল নাম্বারটি সার্চ বক্সে বসান। কোনো রেজিস্ট্রেশন লাগবে না।",
	},
	{
		icon: BarChart3,
		step: "০২",
		title: "কুরিয়ার হিস্ট্রি দেখুন",
		desc: "বিভিন্ন কুরিয়ার থেকে নেওয়া মোট পার্সেল, ডেলিভারি ও ক্যানসেল কাউন্ট এক নজরে পান।",
	},
	{
		icon: ShieldCheck,
		step: "০৩",
		title: "স্মার্ট সিদ্ধান্ত নিন",
		desc: "সাকসেস রেশিও দেখে নিশ্চিত হয়ে দিন — COD পাঠাবেন নাকি এড়িয়ে যাবেন, নিজেই ঠিক করুন।",
	},
];

function HowItWorks() {
	return (
		<section id="how" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
						<Sparkles className="h-4 w-4" /> কিভাবে কাজ করে
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
						মাত্র ৩টি ধাপে নিশ্চিন্ত ব্যবসা
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						অগ্রিম টাকা ছাড়া পার্সেল পাঠানোর ঝুঁকি বুঝতে যা লাগে, সবই পাবেন কয়েক সেকেন্ডে।
					</p>
				</div>

				<div className="relative mt-14 grid gap-8 md:grid-cols-3">
					<div
						aria-hidden
						className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-emerald-200 md:block"
					/>
					{steps.map((s) => (
						<div
							key={s.step}
							className="group relative rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
						>
							<div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 transition-transform group-hover:scale-110">
								<s.icon className="h-9 w-9" />
								<span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold text-emerald-700 shadow ring-1 ring-emerald-200">
									{s.step}
								</span>
							</div>
							<h3 className="mt-6 text-xl font-bold text-slate-900">
								{s.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-500">
								{s.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const features = [
	{
		icon: PackageSearch,
		title: "মোবাইল নাম্বার সার্চ",
		desc: "শুধু একটি মোবাইল নাম্বার দিয়েই কাস্টমারের সম্পূর্ণ পার্সেল হিস্ট্রি বের করে আনুন।",
		accent: "bg-emerald-100 text-emerald-700",
	},
	{
		icon: BarChart3,
		title: "কুরিয়ার হিস্ট্রি",
		desc: "পাথাও, স্টেডফাস্ট, RedX — সব কুরিয়ারে নেওয়া পার্সেলের পূর্ণাঙ্গ হিস্ট্রি এক জায়গায়।",
		accent: "bg-teal-100 text-teal-700",
	},
	{
		icon: TrendingUp,
		title: "সাকসেস রেশিও",
		desc: "কতটি পার্সেল কাস্টমার রিসিভ করেছে, কতটি ক্যানসেল করেছে — শতকরা হারে দেখুন।",
		accent: "bg-emerald-100 text-emerald-700",
	},
	{
		icon: Gauge,
		title: "রিস্ক স্কোর",
		desc: "কাস্টমারের নির্ভরযোগ্যতা একটি সহজ স্কোরে — বোঝা সহজ, সিদ্ধান্ত নেওয়া দ্রুত।",
		accent: "bg-amber-100 text-amber-700",
	},
	{
		icon: Network,
		title: "মাল্টি-কুরিয়ার সাপোর্ট",
		desc: "৫০+ কুরিয়ার পার্টনারের ডেটা এক প্ল্যাটফর্মে — এক চেকেই সব জানুন।",
		accent: "bg-teal-100 text-teal-700",
	},
	{
		icon: Zap,
		title: "ইনস্ট্যান্ট রেজাল্ট",
		desc: "১ সেকেন্ডেরও কম সময়ে রেজাল্ট — অর্ডার আসার সাথে সাথে চেক করুন।",
		accent: "bg-emerald-100 text-emerald-700",
	},
];

function Features() {
	return (
		<section id="features" className="section-pad bg-white/60">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
						<Sparkles className="h-4 w-4" /> ফিচারসমূহ
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
						COD লোকসান কমানোর পূর্ণাঙ্গ সমাধান
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						যে তথ্যগুলো আগে জানতে চাইতেন, এখন সেগুলো পাবেন এক ক্লিকে।
					</p>
				</div>

				<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((f) => (
						<div
							key={f.title}
							className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
						>
							<div
								className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.accent} transition-transform group-hover:scale-110`}
							>
								<f.icon className="h-6 w-6" />
							</div>
							<h3 className="mt-5 text-lg font-bold text-slate-900">
								{f.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-500">
								{f.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Report preview                                                      */
/* ------------------------------------------------------------------ */

const reportBullets = [
	{
		icon: PackageSearch,
		title: "মোট পার্সেল সংখ্যা",
		desc: "এই নাম্বারে সব কুরিয়ারে মোট কতটি পার্সেল নেওয়া হয়েছে।",
	},
	{
		icon: CheckCircle2,
		title: "সফল ডেলিভারি",
		desc: "কাস্টমার কতটি পার্সেল হাতে পেয়ে পেমেন্ট করেছেন।",
	},
	{
		icon: XCircle,
		title: "ক্যানসেল ও রিফিউজ",
		desc: "কতটি পার্সেল নেননি বা ক্যানসেল করেছেন — সবচেয়ে বড় সতর্কতা।",
	},
	{
		icon: TrendingUp,
		title: "সাকসেস রেশিও",
		desc: "ডেলিভারি বনাম ক্যানসেলের শতকরা হার — সিদ্ধান্তের মূল চাবিকাঠি।",
	},
];

function ReportPreview() {
	return (
		<section id="report" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-14 lg:grid-cols-2">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
							<BarChart3 className="h-4 w-4" /> রিপোর্ট প্রিভিউ
						</span>
						<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
							এক নাম্বারেই <span className="gradient-text">সম্পূর্ণ ছবি</span>
						</h2>
						<p className="mt-4 text-lg leading-relaxed text-slate-600">
							কুরিয়ারবাইট রিপোর্টে কাস্টমারের পার্সেল গ্রহণের পুরো ইতিহাস সাজানো থাকে — যা দেখে
							আপনি নিশ্চিন্তে সিদ্ধান্ত নিতে পারবেন।
						</p>

						<ul className="mt-8 space-y-5">
							{reportBullets.map((b) => (
								<li key={b.title} className="flex items-start gap-4">
									<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
										<b.icon className="h-5 w-5" />
									</span>
									<div>
										<h3 className="font-bold text-slate-900">{b.title}</h3>
										<p className="mt-0.5 text-sm text-slate-500">{b.desc}</p>
									</div>
								</li>
							))}
						</ul>

						<a
							href="#hero"
							className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
						>
							নিজেই চেক করে দেখুন
							<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
						</a>
					</div>

					<div className="relative">
						<div
							aria-hidden
							className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-200/60 via-teal-100/60 to-transparent blur-xl"
						/>
						<div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-emerald-900/15 ring-1 ring-slate-100">
							<ReportCardMock compact />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Why choose us                                                       */
/* ------------------------------------------------------------------ */

const reasons = [
	{
		icon: Database,
		value: "৯৯.৯%",
		title: "আপটাইম গ্যারান্টি",
		desc: "ক্লাউড বেসড নিরাপদ আর্কিটেকচার — ব্যবসার সময় সার্ভার ডাউন নিয়ে চিন্তা নেই।",
	},
	{
		icon: Zap,
		value: "< ১ সেকেন্ড",
		title: "সুপার ফাস্ট রেজাল্ট",
		desc: "লাইটওয়েট সিস্টেম — যে ইন্টারনেট স্পিডেই হোক, রেজাল্ট পাবেন তাৎক্ষণিক।",
	},
	{
		icon: Headphones,
		value: "২৪/৭",
		title: "ডেডিকেটেড সাপোর্ট",
		desc: "ফোন, ইমেইল বা লাইভ চ্যাট — যেকোনো সমস্যায় আমাদের টিম সবসময় পাশে।",
	},
];

function WhyChooseUs() {
	return (
		<section id="why" className="section-pad bg-white/60">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
						<ShieldCheck className="h-4 w-4" /> কেন কুরিয়ারবাইট
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
						বিশ্বস্ততা ও গতি — দুটোই আমাদের স্ট্যান্ডার্ড
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						প্রযুক্তির সর্বোচ্চ ব্যবহার নিশ্চিত করে বানানো হয়েছে আপনার ব্যবসার জন্য।
					</p>
				</div>

				<div className="mt-14 grid gap-6 md:grid-cols-3">
					{reasons.map((r) => (
						<div
							key={r.title}
							className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
						>
							<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 transition-transform group-hover:scale-110">
								<r.icon className="h-7 w-7" />
							</div>
							<p className="mt-5 text-3xl font-extrabold text-slate-900">
								{r.value}
							</p>
							<h3 className="mt-1 text-lg font-bold text-emerald-700">
								{r.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-slate-500">
								{r.desc}
							</p>
						</div>
					))}
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
		price: "৳০",
		period: "চিরতরে",
		desc: "নতুন ব্যবসার জন্য পারফেক্ট",
		features: ["মাসে ১০টি চেক", "বেসিক রিপোর্ট", "সাকসেস রেশিও", "ইমেইল সাপোর্ট"],
		cta: "ফ্রিতে শুরু করুন",
		popular: false,
	},
	{
		name: "প্রো",
		price: "৳২৯৯",
		period: "/মাস",
		desc: "ব্যস্ত ই-কমার্সের জন্য সেরা",
		features: [
			"মাসে ৫০০টি চেক",
			"সম্পূর্ণ রিপোর্ট ও রিস্ক স্কোর",
			"কুরিয়ারভিত্তিক ব্রেকডাউন",
			"এক্সপোর্ট সুবিধা",
			"প্রায়োরিটি সাপোর্ট",
		],
		cta: "প্রো শুরু করুন",
		popular: true,
	},
	{
		name: "বিজনেস",
		price: "৳৯৯৯",
		period: "/মাস",
		desc: "বড় প্রতিষ্ঠানের জন্য কাস্টম",
		features: [
			"আনলিমিটেড চেক",
			"API অ্যাক্সেস",
			"মাল্টি-ইউজার অ্যাকাউন্ট",
			"কাস্টম রিপোর্ট",
			"ডেডিকেটেড সাপোর্ট ম্যানেজার",
		],
		cta: "বিজনেস শুরু করুন",
		popular: false,
	},
];

function Pricing() {
	return (
		<section id="pricing" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
						<Users className="h-4 w-4" /> প্রাইসিং
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
						আপনার ব্যবসার জন্য সঠিক প্ল্যান
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						যেকোনো প্ল্যানে বিনামূল্যে সেটআপ — কোনো হিডেন চার্জ নেই।
					</p>
				</div>

				<div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl ${
								plan.popular
									? "border-emerald-500 shadow-xl shadow-emerald-600/10 ring-2 ring-emerald-500/60 md:-translate-y-3 md:hover:-translate-y-4"
									: "border-slate-100"
							}`}
						>
							{plan.popular && (
								<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
									🔥 সবচেয়ে জনপ্রিয়
								</span>
							)}
							<h3 className="text-lg font-bold text-slate-400">{plan.name}</h3>
							<div className="mt-3 flex items-baseline gap-1">
								<span className="text-4xl font-extrabold text-slate-900">
									{plan.price}
								</span>
								<span className="text-sm font-semibold text-slate-400">
									{plan.period}
								</span>
							</div>
							<p className="mt-2 text-sm font-medium text-slate-500">
								{plan.desc}
							</p>

							<ul className="mt-6 flex-1 space-y-3">
								{plan.features.map((f) => (
									<li
										key={f}
										className="flex items-start gap-2.5 text-sm text-slate-600"
									>
										<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
										{f}
									</li>
								))}
							</ul>

							<a
								href="#contact"
								className={`mt-8 rounded-xl px-6 py-3.5 text-center font-bold transition-all ${
									plan.popular
										? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 hover:shadow-xl"
										: "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
								}`}
							>
								{plan.cta}
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const faqs = [
	{
		q: "কুরিয়ারবাইট কীভাবে কাজ করে?",
		a: "আপনি কাস্টমারের মোবাইল নাম্বার দিয়ে চেক করলে আমরা বিভিন্ন কুরিয়ার পার্টনার থেকে সেই নাম্বারে নেওয়া পার্সেলের হিস্ট্রি সংগ্রহ করে একটি সহজ রিপোর্টে দেখাই — মোট পার্সেল, ডেলিভারি, ক্যানসেল ও সাকসেস রেশিও।",
	},
	{
		q: "শুধু মোবাইল নাম্বার দিয়েই কি এত তথ্য পাওয়া যায়?",
		a: "হ্যাঁ। বাংলাদেশের কুরিয়ার সেবাগুলো পার্সেল গ্রহণের সময় মোবাইল নাম্বার যাচাই করে, তাই নাম্বার দিয়েই একজন কাস্টমারের গ্রহণের ইতিহাস বের করা সম্ভব।",
	},
	{
		q: "কাস্টমারের তথ্য কি নিরাপদ থাকবে?",
		a: "অবশ্যই। আমরা শুধু পার্সেল হিস্ট্রি সম্পর্কিত প্রয়োজনীয় তথ্যই দেখাই — ব্যক্তিগত তথ্য, ঠিকানা বা আর্থিক বিষয় সম্পূর্ণ গোপন রাখা হয়। SSL এনক্রিপশন ব্যবহৃত হয়।",
	},
	{
		q: "কোন কোন কুরিয়ারের হিস্ট্রি পাওয়া যায়?",
		a: "পাথাও, স্টেডফাস্ট, RedX, সান্দারবান সহ দেশের ৫০+ জনপ্রিয় কুরিয়ারের হিস্ট্রি ধাপে ধাপে যুক্ত হচ্ছে।",
	},
	{
		q: "রেজাল্ট পেতে কত সময় লাগে?",
		a: "সাধারণত ১ সেকেন্ডেরও কম সময়ে রেজাল্ট পাওয়া যায়। নেটওয়ার্ক ধীর থাকলে কয়েক সেকেন্ডও লাগতে পারে।",
	},
];

function Faq() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section id="faq" className="section-pad bg-white/60">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
						<MessageCircle className="h-4 w-4" /> FAQ
					</span>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
						প্রায়শই জিজ্ঞাসিত প্রশ্ন
					</h2>
				</div>

				<div className="mx-auto mt-12 max-w-3xl space-y-3">
					{faqs.map((faq, i) => {
						const isOpen = open === i;
						return (
							<div
								key={faq.q}
								className={`overflow-hidden rounded-2xl border bg-white transition-all ${
									isOpen
										? "border-emerald-200 shadow-md"
										: "border-slate-100 shadow-sm"
								}`}
							>
								<button
									type="button"
									onClick={() => setOpen(isOpen ? null : i)}
									className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
									aria-expanded={isOpen}
								>
									<span className="font-bold text-slate-800">{faq.q}</span>
									<span
										className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
											isOpen
												? "bg-emerald-600 text-white"
												: "bg-emerald-50 text-emerald-700"
										}`}
									>
										<ChevronDown
											className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
										/>
									</span>
								</button>
								<div
									className={`grid transition-all duration-300 ease-in-out ${
										isOpen
											? "grid-rows-[1fr] opacity-100"
											: "grid-rows-[0fr] opacity-0"
									}`}
								>
									<div className="overflow-hidden">
										<p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">
											{faq.a}
										</p>
									</div>
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
/* Contact CTA                                                         */
/* ------------------------------------------------------------------ */

const contactInfo = [
	{
		icon: MapPin,
		title: "অফিস ঠিকানা",
		lines: ["লেভেল-০, লেইন-১, ব্লক-এ", "হালিশহর, চট্টগ্রাম"],
	},
	{
		icon: Phone,
		title: "হটলাইন",
		lines: ["01891-614300", "01688-444555"],
	},
	{
		icon: Mail,
		title: "ইমেইল",
		lines: ["business.appbyte@gmail.com"],
	},
];

function ContactCta() {
	return (
		<section id="contact" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				{/* CTA panel */}
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-6 py-16 text-center shadow-2xl shadow-emerald-900/30 md:px-16">
					<div
						aria-hidden
						className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl"
					/>
					<div className="relative">
						<Clock className="mx-auto h-10 w-10 text-emerald-200" />
						<h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-4xl">
							আজই শুরু করুন — প্রতিটি পার্সেল হোক লাভজনক
						</h2>
						<p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-50/90">
							পার্সেল পাঠানোর আগে কাস্টমার চেক করা এখন প্রতিটি সফল ই-কমার্স ব্যবসার অভ্যাস। ফ্রি
							প্ল্যান দিয়ে শুরু করুন।
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<a
								href="#hero"
								className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-emerald-800 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
							>
								<Search className="h-5 w-5" />
								বিনামূল্যে চেক শুরু করুন
							</a>
							<a
								href="mailto:business.appbyte@gmail.com"
								className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
							>
								<MessageCircle className="h-5 w-5" />
								সাপোর্টে কথা বলুন
							</a>
						</div>
					</div>
				</div>

				{/* Contact cards */}
				<div className="mt-12 grid gap-6 md:grid-cols-3">
					{contactInfo.map((c) => (
						<div
							key={c.title}
							className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
						>
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
								<c.icon className="h-5 w-5" />
							</span>
							<div>
								<h3 className="font-bold text-slate-900">{c.title}</h3>
								{c.lines.map((line) => (
									<p key={line} className="mt-0.5 text-sm text-slate-500">
										{line}
									</p>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Home() {
	return (
		<div>
			<Hero />
			<CourierMarquee />
			<HowItWorks />
			<Features />
			<ReportPreview />
			<WhyChooseUs />
			<Pricing />
			<Faq />
			<ContactCta />
		</div>
	);
}
