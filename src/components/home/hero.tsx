// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Boxes,
	ChevronRight,
	Home,
	LayoutGrid,
	Package,
	Phone,
	Search,
	ShieldCheck,
	Smartphone,
	User,
	XCircle,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/userContext";

/* ============================ custom SVGs ============================ */

/* 3D gold parcel box (custom SVG, no icon lib) */
function GoldParcel({ className = "" }) {
	return (
		<svg
			viewBox="0 0 48 48"
			className={className}
			aria-hidden="true"
			fill="none"
		>
			<polygon
				points="24,6 42,15 24,24 6,15"
				fill="#F6C45B"
				stroke="#F6C45B"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<polygon
				points="6,15 24,24 24,44 6,35"
				fill="#E8A83B"
				stroke="#E8A83B"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<polygon
				points="42,15 24,24 24,44 42,35"
				fill="#C9862B"
				stroke="#C9862B"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<polygon points="6,22.5 24,31.5 24,35.5 6,26.5" fill="#B5761F" />
			<polygon points="42,22.5 24,31.5 24,35.5 42,26.5" fill="#9C661A" />
		</svg>
	);
}

/* glowing parcel circle node */
function ParcelCircle({ className = "" }) {
	return (
		<div
			className={`flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-accent/30 bg-[#0b2129] shadow-[0_0_30px_rgba(16,185,129,0.35),inset_0_0_18px_rgba(16,185,129,0.12)] ${className}`}
		>
			<GoldParcel className="h-11 w-11" />
		</div>
	);
}

/* glowing connector lines (curved), drawn per side */
function ConnectorLines({ side }) {
	const isLeft = side === "left";
	const paths = isLeft
		? [
				{
					d: "M62 150 C 28 144 36 76 2 72",
					x1: 62,
					y1: 150,
					x2: 2,
					y2: 72,
				},
				{
					d: "M62 258 C 28 264 36 324 2 328",
					x2: 2,
					y2: 328,
					x1: 62,
					y1: 258,
				},
			]
		: [
				{
					d: "M2 178 C 44 172 44 40 86 36",
					x2: 86,
					y2: 36,
					x1: 2,
					y1: 178,
				},
				{
					d: "M2 198 C 44 198 44 196 86 196",
					x2: 86,
					y2: 196,
					x1: 2,
					y1: 198,
				},
				{
					d: "M2 218 C 44 224 44 324 86 328",
					x2: 86,
					y2: 328,
					x1: 2,
					y1: 218,
				},
			];

	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 88 400"
			preserveAspectRatio="none"
			className={`pointer-events-none absolute top-0 hidden h-full xl:block ${
				isLeft ? "right-full w-16" : "left-full w-[88px]"
			}`}
		>
			{paths.map((p) => (
				<g key={side + p.d}>
					<path
						d={p.d}
						stroke="#2fd28f"
						strokeWidth="5"
						strokeOpacity="0.22"
						fill="none"
						filter="url(#cbGlow)"
					/>
					<path
						d={p.d}
						stroke="#35d795"
						strokeWidth="1.5"
						strokeOpacity="0.85"
						fill="none"
					/>
					<circle
						cx={p.x1}
						cy={p.y1}
						r="3"
						fill="#7cebb8"
						filter="url(#cbGlow)"
					/>
					<circle
						cx={p.x2}
						cy={p.y2}
						r="3"
						fill="#7cebb8"
						filter="url(#cbGlow)"
					/>
				</g>
			))}
		</svg>
	);
}

/* filled gold shield with check (custom) */
function ShieldGold({ className = "" }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<path
				d="M12 1.8 20.2 5v6.1c0 5.6-3.4 9.5-8.2 11.3C7.2 20.6 3.8 16.7 3.8 11.1V5Z"
				fill="#F2B33D"
				stroke="#D99A26"
				strokeWidth="1.2"
			/>
			<path
				d="m8.3 11.6 2.6 2.6 4.8-5.2"
				stroke="#0A1D26"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}

/* white filled circle play icon (custom) */
function PlayIcon({ className = "" }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<circle cx="12" cy="12" r="11" fill="#FFFFFF" />
			<path d="M10 8.2 16 12l-6 3.8Z" fill="#071A21" />
		</svg>
	);
}

/* ============================ data ============================ */

const dashboardRows = [
	{ id: "confirm-1", badge: "কন্ফার্ম হয়েছে", tone: "green" },
	{ id: "ready", badge: "রেডি হয়েছে", tone: "gold" },
	{ id: "risk", badge: "উচ্চ ঝুঁকি", tone: "red" },
	{ id: "confirm-2", badge: "কন্ফার্ম হয়েছে", tone: "green" },
];

const badgeTones = {
	green: "bg-accent/15 text-[#4ADE80] ring-[#4ADE80]/25",
	gold: "bg-gold/15 text-gold ring-gold/30",
	red: "bg-rose-500/15 text-[#F87171] ring-rose-500/30",
};

const sidebarIcons = [Home, Package, BarChart3, ShieldCheck, User];

const highlights = [
	{
		id: "couriers",
		icon: "boxes",
		title: "বড় কুরিয়ার",
		desc: "একই নম্বরের সব বড় কুরিয়ারের রেকর্ড এক জায়গায়",
	},
	{
		id: "report",
		icon: "bolt",
		title: "দ্রুত রিপোর্ট",
		desc: "রিয়েল-টাইমের রিপোর্ট দেখে সিদ্ধান্ত নিন নিশ্চিন্তে",
	},
	{
		id: "smart",
		icon: "shield",
		title: "স্মার্ট ঝুঁকি সংকেত",
		desc: "স্মার্ট অ্যালগরিদমের মাধ্যমে ঝুঁকির মাত্রা সহজেই বুঝুন",
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
		desc: "বড় কুরিয়ারের রেকর্ড ও ঝুঁকি সংকেত এক জায়গায় দেখুন।",
	},
	{
		number: "৩",
		icon: ShieldCheck,
		title: "সিদ্ধান্ত নিন",
		desc: "তথ্য দেখে আত্মবিশ্বাসের সাথে আপনার COD সিদ্ধান্ত নিন।",
	},
];

/* ============================ hero ============================ */

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
			{/* shared svg defs for connector glow */}
			<svg width="0" height="0" className="absolute" aria-hidden="true">
				<defs>
					<filter id="cbGlow" x="-60%" y="-60%" width="220%" height="220%">
						<feGaussianBlur stdDeviation="3" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
			</svg>

			{/* background: glows + dotted map pattern */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-accent/15 blur-[120px]" />
				<div className="absolute -right-40 -top-48 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px]" />
				<div className="absolute -bottom-24 left-1/3 h-64 w-[60%] rounded-full bg-accent/10 blur-[100px]" />
				<div className="absolute right-[4%] top-[6%] h-[420px] w-[580px] opacity-70 [background-image:radial-gradient(rgba(84,214,166,0.16)_1.2px,transparent_1.4px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,black,transparent_78%)]" />
				<div className="absolute left-[18%] top-[16%] h-[300px] w-[380px] opacity-40 [background-image:radial-gradient(rgba(84,214,166,0.12)_1px,transparent_1.2px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,black,transparent_75%)]" />
			</div>

			<div className="maxw relative z-10 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
				<div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-6">
					{/* ---------- left: headline + CTAs ---------- */}
					<div className="lg:col-span-4">
						<h1 className="text-[2.6rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[3.1rem] xl:text-[3.55rem]">
							রিটার্ন কমান,
							<br />
							<span className="text-accent">আয় বাড়ান</span>
						</h1>
						<p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/65">
							বড় কুরিয়ারের রেকর্ড এক জায়গায় এনে আপনার COD সিদ্ধান্তকে আরও সহজ করুন।
						</p>
						<div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
							<Link
								to="/login"
								className="inline-flex items-center gap-2.5 rounded-[10px] bg-gradient-to-b from-[#189A68] to-[#0D6B47] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#1CAB74] hover:to-[#0F7D52]"
							>
								শুরু করুন
								<ArrowRight className="h-5 w-5" />
							</Link>
							<button
								type="button"
								onClick={scrollToFeatures}
								className="inline-flex cursor-pointer items-center gap-2.5 text-[15px] font-semibold text-white/90 transition-colors hover:text-white"
							>
								<PlayIcon className="h-6 w-6" />
								ফিচার কাজ করে
							</button>
						</div>
					</div>

					{/* ---------- center: seller dashboard + parcels ---------- */}
					<div className="relative mx-auto w-full max-w-md pt-5 lg:col-span-5 lg:max-w-none">
						{/* floating badge */}
						<div className="absolute -top-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-[10px] border border-white/10 bg-[#0D242E] px-3 py-2 shadow-xl shadow-black/40">
							<span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-b from-[#1FAE74] to-[#0E7A4F]">
								<LayoutGrid className="h-3.5 w-3.5 text-white" />
							</span>
							<span className="text-xs font-bold text-white">আপনার ব্যবসা</span>
						</div>

						{/* left parcel nodes */}
						<div className="pointer-events-none absolute right-full top-[18%] z-10 hidden -translate-y-1/2 translate-x-[-64px] xl:flex">
							<ParcelCircle />
						</div>
						<div className="pointer-events-none absolute right-full top-[82%] z-10 hidden -translate-y-1/2 translate-x-[-64px] xl:flex">
							<ParcelCircle />
						</div>
						<ConnectorLines side="left" />

						{/* right parcel nodes */}
						<div className="pointer-events-none absolute left-full top-[9%] z-10 hidden -translate-y-1/2 translate-x-[88px] xl:flex">
							<ParcelCircle />
						</div>
						<div className="pointer-events-none absolute left-full top-[49%] z-10 hidden -translate-y-1/2 translate-x-[88px] xl:flex">
							<ParcelCircle />
						</div>
						<div className="pointer-events-none absolute left-full top-[82%] z-10 hidden -translate-y-1/2 translate-x-[88px] xl:flex">
							<ParcelCircle />
						</div>
						<ConnectorLines side="right" />

						{/* dashboard window */}
						<div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0D222D] shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(16,185,129,0.12)]">
							<div className="flex">
								<aside className="flex w-12 flex-col items-center gap-4 border-r border-white/8 py-6 sm:w-14">
									{sidebarIcons.map((Icon, index) => (
										<span
											key={Icon.displayName ?? index}
											className={`flex h-9 w-9 items-center justify-center rounded-lg ${
												index === 0 ? "text-accent-strong" : "text-white/35"
											}`}
										>
											<Icon className="h-[18px] w-[18px]" />
										</span>
									))}
								</aside>

								<div className="flex-1 p-4 sm:p-5">
									<h3 className="text-[15px] font-bold text-white">
										সেলার ড্যাশবোর্ড
									</h3>
									<p className="mt-3 text-xs font-semibold text-white/60">
										সাম্প্রতিক কার্যক্রম
									</p>
									<ul className="mt-2.5 space-y-2.5">
										{dashboardRows.map((row) => (
											<li
												key={row.id}
												className="flex items-center gap-2.5 rounded-[10px] border border-white/5 bg-[#0A1D26] px-3 py-2.5"
											>
												<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2A3B44] text-white/55">
													<User className="h-4 w-4" />
												</span>
												<span className="flex-1 space-y-1.5">
													<span className="block h-1.5 w-16 max-w-full rounded-full bg-white/25" />
													<span className="block h-1.5 w-10 rounded-full bg-white/15" />
												</span>
												<span
													className={`shrink-0 rounded-md px-2 py-[3px] text-[10px] font-bold ring-1 ${badgeTones[row.tone]}`}
												>
													{row.badge}
												</span>
												<ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/60" />
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* ---------- right: phone check card ---------- */}
					<div className="lg:col-span-3">
						<div className="mx-auto w-full max-w-md rounded-2xl border border-white/8 bg-[#0D232E] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:max-w-none">
							<h3 className="text-[17px] font-bold text-white">
								গ্রাহকের নম্বর দিন
							</h3>
							<form onSubmit={handleSubmit} className="mt-4">
								<label className="relative block">
									<span className="sr-only">গ্রাহকের মোবাইল নম্বর</span>
									<Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
									<input
										type="tel"
										inputMode="numeric"
										value={phone}
										onChange={handleChange}
										placeholder="মোবাইল নম্বর লিখুন"
										className="h-12 w-full rounded-[10px] border border-white/10 bg-[#0A1D26] pl-11 pr-4 text-[15px] font-semibold tracking-wider text-white outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-white/35 focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
									/>
								</label>
								<button
									type="submit"
									className="mt-3 h-12 w-full rounded-[10px] bg-gradient-to-b from-[#189A68] to-[#0D6B47] text-[15px] font-bold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:from-[#1CAB74] hover:to-[#0F7D52]"
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
							<div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-[#0A1D26] p-4">
								<ShieldGold className="h-9 w-9 shrink-0" />
								<div>
									<p className="text-[15px] font-bold text-gold">স্মার্ট সুরক্ষা</p>
									<p className="mt-0.5 text-xs text-white/55">
										সত্যতার সাথে লেনদেন করুন
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ---------- highlights strip ---------- */}
				<div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] md:mt-16">
					<div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
						{highlights.map((item) => (
							<div
								key={item.id}
								className="flex items-center gap-4 px-6 py-5 sm:px-7"
							>
								{item.icon === "boxes" ? (
									<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#1FAE74] to-[#0E7A4F] shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
										<Boxes className="h-6 w-6 text-white" />
									</span>
								) : item.icon === "bolt" ? (
									<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#1FAE74] to-[#0E7A4F] shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
										<Zap
											className="h-6 w-6 fill-white text-white"
											fill="white"
										/>
									</span>
								) : (
									<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold/60 bg-[#0A1D26]">
										<ShieldGold className="h-6 w-6" />
									</span>
								)}
								<div>
									<p className="text-[16px] font-bold text-white">
										{item.title}
									</p>
									<p className="mt-0.5 text-[12.5px] leading-relaxed text-white/55">
										{item.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ---------- 3 easy steps ---------- */}
				<div className="mt-16 md:mt-20">
					<h2 className="text-center text-[26px] font-extrabold tracking-tight text-white sm:text-3xl">
						সহজ তিন ধাপে স্মার্ট সিদ্ধান্ত
					</h2>
					<div className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-7">
						{/* dashed connectors with end dot */}
						<div
							aria-hidden
							className="absolute top-1/2 hidden -translate-y-1/2 items-center md:flex"
							style={{ left: "calc(33.333% - 1.5rem)", width: "3rem" }}
						>
							<span className="flex-1 border-t border-dashed border-white/25" />
							<span className="h-2 w-2 shrink-0 rounded-full bg-accent-strong shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
						</div>
						<div
							aria-hidden
							className="absolute top-1/2 hidden -translate-y-1/2 items-center md:flex"
							style={{ left: "calc(66.666% - 1.5rem)", width: "3rem" }}
						>
							<span className="flex-1 border-t border-dashed border-white/25" />
							<span className="h-2 w-2 shrink-0 rounded-full bg-accent-strong shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
						</div>

						{steps.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.number}
									className="relative flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0C222C] p-5 pr-4 transition-colors duration-300 hover:border-accent/40"
								>
									<span className="absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#1FAE74] to-[#0F7D51] text-[15px] font-extrabold text-white shadow-[0_6px_16px_rgba(16,185,129,0.45)] ring-4 ring-night">
										{step.number}
									</span>
									<span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04]">
										<Icon className="h-8 w-8 text-white" strokeWidth={1.8} />
									</span>
									<div className="pt-1">
										<h3 className="text-[17px] font-bold text-white">
											{step.title}
										</h3>
										<p className="mt-1 text-[13px] leading-relaxed text-white/55">
											{step.desc}
										</p>
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
