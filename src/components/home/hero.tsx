import MiniDashboard from "./miniDashboard";
import SearchDemo from "./searchDemo";

const avatarColors = [
	"bg-emerald-600",
	"bg-teal-600",
	"bg-amber-500",
	"bg-slate-700",
];
const avatarInitials = ["RA", "SH", "MK", "+"];

const stats = [
	{ value: "৫টি", label: "প্রতিদিন ফ্রি সার্চ" },
	{ value: "৫০+", label: "কুরিয়ার ডেটা" },
	{ value: "১ সেকেন্ড", label: "রিপোর্ট টাইম" },
	{ value: "৳১,৮০০+", label: "সম্ভাব্য সাশ্রয় (উদাহরণ)" },
];

export default function Hero() {
	return (
		<section id="hero" className="relative overflow-hidden bg-[#f4faf6]">
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -left-40 -top-52 h-[34rem] w-[34rem] rounded-full bg-emerald-200/40 blur-3xl" />
				<div className="absolute -right-48 top-20 h-[30rem] w-[30rem] rounded-full bg-teal-100/70 blur-3xl" />
				<div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(15,107,77,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,107,77,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
			</div>

			<div className="maxw relative z-10 px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20 lg:px-8 lg:pt-2">
				<div className="grid items-center gap-14 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
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
								{avatarColors.map((color, index) => (
									<span
										key={color}
										className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f4faf6] ${color} text-[9px] font-bold text-white`}
									>
										{avatarInitials[index]}
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
					{stats.map((item) => (
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
