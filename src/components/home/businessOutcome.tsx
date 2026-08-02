import {
	ArrowDownRight,
	ArrowRight,
	CircleDollarSign,
	RefreshCw,
	Target,
	TrendingDown,
	TrendingUp,
} from "lucide-react";

const outcomes = [
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
];

export default function BusinessOutcome() {
	return (
		<section className="section-pad bg-secondary-dark text-white">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
							আপনার লাভের হিসাব
						</p>
						<h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
							কুরিয়ার ফি কমলেই লাভ বাড়ে — হিসাবটা এতই সহজ
						</h2>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
							একজন কাস্টমার পার্সেল না নিলে পণ্যের লাভ তো যায়ই, সঙ্গে যোগ হয় ডেলিভারি ও
							রিটার্ন চার্জ। কুরিয়ারবাইট সেই সিদ্ধান্তটা অর্ডার পাঠানোর আগেই সহজ করে।
						</p>
						<a
							href="#pricing"
							className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-secondary transition hover:-translate-y-0.5 hover:bg-secondary/10"
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
							<ArrowRight className="hidden h-5 w-5 text-white/75 sm:block" />
							<ArrowDownRight className="h-5 w-5 text-white/75 sm:hidden" />
						</div>
						<div className="rounded-2xl border border-white/20 bg-white/[0.09] p-5">
							<div className="flex items-center justify-between">
								<span className="text-xs font-bold text-white/80">
									চেক করলে (উদাহরণ)
								</span>
								<TrendingUp className="h-4 w-4 text-white/75" />
							</div>
							<p className="mt-4 text-3xl font-extrabold text-white/75">
								+৳ ৩৫০
							</p>
							<p className="mt-2 text-xs leading-relaxed text-white/60">
								ঝুঁকিপূর্ণ অর্ডার আগে বুঝে, সঠিক কাস্টমারে ফোকাস
							</p>
						</div>
					</div>
				</div>
				<div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
					{outcomes.map((item) => {
						const Icon = item.icon;
						return (
							<div key={item.title} className="flex gap-3">
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/75">
									<Icon className="h-4 w-4" />
								</span>
								<div>
									<p className="text-sm font-bold text-white">{item.title}</p>
									<p className="mt-1 text-xs leading-relaxed text-white/55">
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
