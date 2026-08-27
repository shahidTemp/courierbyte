// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	ChevronRight,
	Home as HomeIcon,
	LayoutGrid,
	Package,
	Phone,
	PlayCircle,
	Search,
	ShieldCheck,
	Smartphone,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/userContext";

/* ------------------------------ data ------------------------------ */

const dashboardRows = [
	{ id: "delivered-1", badge: "সফল ডেলিভারি", tone: "green" },
	{ id: "processing", badge: "প্রসেসিং", tone: "yellow" },
	{ id: "high-risk", badge: "উচ্চ ঝুঁকি", tone: "red" },
	{ id: "delivered-2", badge: "সফল ডেলিভারি", tone: "green" },
];

const badgeTones = {
	green: "bg-accent/15 text-accent-strong ring-accent/25",
	yellow: "bg-gold/15 text-gold ring-gold/30",
	red: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
};

const sidebarIcons = [HomeIcon, Package, BarChart3, ShieldCheck, User];

const highlights = [
	{
		icon: Package,
		tone: "green",
		title: "সব কুরিয়ার",
		desc: "একই নম্বরের সব কুরিয়ারের রেকর্ড এক জায়গায়",
	},
	{
		icon: Zap,
		tone: "green",
		title: "দ্রুত ফলাফল",
		desc: "রিয়েল-টাইম রিপোর্ট দেখে সাথে সাথে সিদ্ধান্ত নিন",
	},
	{
		icon: ShieldCheck,
		tone: "gold",
		title: "স্মার্ট ঝুঁকি সংকেত",
		desc: "স্মার্ট অ্যালগরিদমে রিটার্ন ঝুঁকির সম্ভাবনা সনাক্ত",
	},
];

const steps = [
	{
		number: "১",
		icon: Smartphone,
		title: "নম্বর দিন",
		desc: "গ্রাহকের মোবাইল নম্বর দিন ও সার্চ করুন।",
	},
	{
		number: "২",
		icon: Search,
		title: "রেকর্ড মিলিয়ে দেখুন",
		desc: "সব কুরিয়ারের রেকর্ড ও ঝুঁকি সংকেত এক জায়গায় দেখুন।",
	},
	{
		number: "৩",
		icon: ShieldCheck,
		title: "সিদ্ধান্ত নিন",
		desc: "তথ্য দেখে আত্মবিশ্বাসের সাথে আপনার COD সিদ্ধান্ত নিন।",
	},
];

/* --------------------------- small pieces --------------------------- */

function ParcelNode() {
	return (
		<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-gradient-to-b from-[#12362a] to-[#0b211a] shadow-[0_0_28px_rgba(16,185,129,0.3)]">
			<Package className="h-5 w-5 text-gold" />
		</div>
	);
}

function ConnectorDot({ side = "right" }) {
	return (
		<span
			className={`h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong shadow-[0_0_10px_rgba(52,211,153,0.9)] ${
				side === "left" ? "order-first" : ""
			}`}
		/>
	);
}

/* ------------------------------ hero ------------------------------ */

export default function Hero() {
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

	const scrollToFeatures = (event) => {
		event.preventDefault();
		document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section id="hero" className="relative overflow-hidden bg-night text-white">
			{/* background glows + dotted map pattern */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-accent/15 blur-[120px]" />
				<div className="absolute -right-40 -top-48 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px]" />
				<div className="absolute left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-accent/5 blur-[110px]" />
				<div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(52,211,153,0.14)_1px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_38%,black,transparent)]" />
			</div>

			<div className="maxw relative z-10 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
				<div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
					{/* ---------- left: headline + CTAs ---------- */}
					<div className="lg:col-span-4">
						<h1 className="text-4xl font-extrabold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[2.75rem] xl:text-[3.4rem]">
							রিটার্ন কমান,
							<br />
							<span className="text-accent">আয় বাড়ান</span>
						</h1>
						<p className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
							সব কুরিয়ারের রেকর্ড এক জায়গায় এনে আপনার COD সিদ্ধান্তকে আরও সহজ করুন।
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
							<Link
								to="/login"
								className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-7 py-3.5 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-accent/40"
							>
								শুরু করুন
								<ArrowRight className="h-4.5 w-4.5" />
							</Link>
							<button
								type="button"
								onClick={scrollToFeatures}
								className="inline-flex cursor-pointer items-center gap-2 font-semibold text-white/75 transition-colors hover:text-white"
							>
								<PlayCircle className="h-6 w-6 text-accent" />
								ফিচার দেখুন
							</button>
						</div>
					</div>

					{/* ---------- center: seller dashboard mockup ---------- */}
					<div className="relative mx-auto w-full max-w-md pt-5 lg:col-span-5 lg:max-w-none xl:px-24">
						{/* floating badge */}
						<div className="absolute -top-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-accent/30 bg-[#0c2b22] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-black/40">
							<LayoutGrid className="h-3.5 w-3.5 text-accent" />
							আপনার ব্যবসা
						</div>

						{/* left parcel node (decoration) */}
						<div
							aria-hidden
							className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 xl:flex"
						>
							<ParcelNode />
							<span className="h-px w-14 bg-gradient-to-r from-transparent via-accent/50 to-accent/70" />
							<ConnectorDot />
						</div>

						{/* right parcel nodes (decoration) */}
						<div
							aria-hidden
							className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-7 xl:flex"
						>
							{[0, 1, 2].map((index) => (
								<div key={index} className="flex items-center gap-1.5">
									<ConnectorDot side="left" />
									<span className="h-px w-14 bg-gradient-to-l from-transparent via-accent/50 to-accent/70" />
									<ParcelNode />
								</div>
							))}
						</div>

						{/* dashboard card */}
						<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-night-soft shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
							<div className="flex">
								<aside className="flex w-14 flex-col items-center gap-2 border-r border-white/5 py-5 sm:w-16">
									{sidebarIcons.map((Icon, index) => (
										<span
											key={Icon.displayName ?? index}
											className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
												index === 0
													? "bg-accent/15 text-accent"
													: "text-white/35"
											}`}
										>
											<Icon className="h-[18px] w-[18px]" />
										</span>
									))}
								</aside>

								<div className="flex-1 p-4 sm:p-5">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-bold text-white sm:text-base">
											সেলার ড্যাশবোর্ড
										</h3>
										<span className="flex items-center gap-1.5 text-[10px] font-semibold text-accent-strong">
											<span className="relative flex h-1.5 w-1.5">
												<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-strong opacity-75" />
												<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-strong" />
											</span>
											লাইভ
										</span>
									</div>

									<div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
										<p className="text-xs font-semibold text-white/60">
											সাম্প্রতিক যাচাই
										</p>
										<ul className="mt-3 space-y-2.5">
											{dashboardRows.map((row) => (
												<li
													key={row.id}
													className="flex items-center gap-3 rounded-lg border border-white/5 bg-night/70 px-3 py-2.5"
												>
													<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50">
														<User className="h-4 w-4" />
													</span>
													<span className="flex-1 space-y-1.5">
														<span className="block h-1.5 w-24 max-w-full rounded-full bg-white/15" />
														<span className="block h-1.5 w-14 rounded-full bg-white/10" />
													</span>
													<span
														className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ring-1 ${badgeTones[row.tone]}`}
													>
														{row.badge}
													</span>
													<ChevronRight className="h-4 w-4 shrink-0 text-accent" />
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* ---------- right: phone check card ---------- */}
					<div className="lg:col-span-3">
						<div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6 lg:max-w-none">
							<h3 className="text-lg font-bold text-white">গ্রাহকের নম্বর দিন</h3>
							<form onSubmit={handleSubmit} className="mt-4">
								<label className="relative block">
									<span className="sr-only">গ্রাহকের মোবাইল নম্বর</span>
									<Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
									<input
										type="tel"
										inputMode="numeric"
										value={phone}
										onChange={handleChange}
										placeholder="মোবাইল নম্বর লিখুন"
										className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-base font-semibold tracking-wider text-white outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-white/35 focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
									/>
								</label>
								<button
									type="submit"
									className="mt-3 w-full rounded-xl bg-accent py-3.5 font-bold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent-strong hover:shadow-accent/40"
								>
									ফলাফল দেখুন
								</button>
							</form>
							{error && (
								<p
									aria-live="polite"
									className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-400"
								>
									<XCircle className="h-4 w-4" /> {error}
								</p>
							)}
							<div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
								<ShieldCheck className="h-8 w-8 shrink-0 text-gold" />
								<div>
									<p className="font-bold text-gold">স্মার্ট সুরক্ষা</p>
									<p className="mt-0.5 text-xs leading-relaxed text-white/55">
										গ্রাহকের তথ্য সম্পূর্ণ গোপনীয় রাখা হয়
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ---------- highlights strip ---------- */}
				<div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur md:mt-20">
					<div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
						{highlights.map((item) => {
							const Icon = item.icon;
							return (
								<div
									key={item.title}
									className="flex items-center gap-4 px-6 py-5"
								>
									<span
										className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
											item.tone === "gold"
												? "bg-gold/15 text-gold"
												: "bg-accent/15 text-accent"
										}`}
									>
										<Icon className="h-5 w-5" />
									</span>
									<div>
										<p className="text-[15px] font-bold text-white">
											{item.title}
										</p>
										<p className="mt-0.5 text-xs leading-relaxed text-white/50">
											{item.desc}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* ---------- 3 easy steps ---------- */}
				<div className="mt-16 md:mt-20">
					<h2 className="text-center text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
						সহজ তিন ধাপে স্মার্ট সিদ্ধান্ত
					</h2>
					<div className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
						<div
							aria-hidden
							className="absolute left-[16%] right-[16%] top-1/2 hidden border-t border-dashed border-white/15 md:block"
						/>
						<span
							aria-hidden
							className="absolute left-[33.33%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-accent/80 md:block"
						>
							<ChevronRight className="h-5 w-5" />
						</span>
						<span
							aria-hidden
							className="absolute left-[66.66%] top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-accent/80 md:block"
						>
							<ChevronRight className="h-5 w-5" />
						</span>
						{steps.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.number}
									className="relative rounded-2xl border border-white/10 bg-night-soft p-6 transition-colors duration-300 hover:border-accent/40"
								>
									<span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-night ring-4 ring-night">
										{step.number}
									</span>
									<span className="mt-2 flex h-14 w-14 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-white shadow-[0_0_24px_rgba(16,185,129,0.25)]">
										<Icon className="h-6 w-6" />
									</span>
									<h3 className="mt-5 text-lg font-bold text-white">
										{step.title}
									</h3>
									<p className="mt-1.5 text-sm leading-relaxed text-white/55">
										{step.desc}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
