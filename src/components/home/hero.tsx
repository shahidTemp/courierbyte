// @ts-nocheck
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	ChevronRight,
	Package,
	PlayCircle,
	Search,
	ShieldCheck,
	Smartphone,
	Zap,
} from "lucide-react";

/* ------------------------------ data ------------------------------ */

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

/* ------------------------------ hero ------------------------------ */

export default function Hero() {
	const scrollToFeatures = (event) => {
		event.preventDefault();
		document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section id="hero" className="relative overflow-hidden bg-night text-white">
			{/* background image */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<img
					src="/images/herobg.png"
					alt=""
					className="h-full w-full object-cover object-center"
				/>
			</div>

			<div className="maxw relative z-10 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
				<div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
					{/* ---------- left: seller dashboard mockup ---------- */}
					<div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
						<img
							src="/images/dashboard1.png"
							alt="কুরিয়ারবাইট সেলার ড্যাশবোর্ড প্রিভিউ"
							className="w-full rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
							loading="lazy"
						/>
					</div>

					{/* ---------- right: headline + CTAs ---------- */}
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
