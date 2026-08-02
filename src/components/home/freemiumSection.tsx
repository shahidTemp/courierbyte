import { ArrowRight, Gauge, Lock, Sparkles } from "lucide-react";
import { freeSearchDots } from "./constants";

export default function FreemiumSection() {
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
