import { ArrowRight, Search, Zap } from "lucide-react";

export default function FinalCta() {
	return (
		<section id="contact" className="pb-20 sm:pb-28">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary to-secondary-dark px-6 py-14 text-center shadow-2xl shadow-secondary/20 sm:px-12">
					<div
						aria-hidden
						className="absolute -left-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl"
					/>
					<div
						aria-hidden
						className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
					/>
					<div className="relative">
						<span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold text-white/75">
							<Zap className="h-3.5 w-3.5" /> আজই আপনার প্রথম চেক করুন
						</span>
						<h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
							আপনার পরের COD অর্ডারটি
							<br />
							অনুমানের ওপর ছেড়ে দেবেন না
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
							প্রতিদিনের ৫টি ফ্রি সার্চ দিয়ে শুরু করুন। কুরিয়ারবাইট আপনার লাভ রক্ষা করতে কতটা
							সাহায্য করে, নিজেই দেখুন।
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<a
								href="#hero"
								className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-secondary shadow-xl transition hover:-translate-y-0.5 hover:bg-secondary/10"
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
						<p className="mt-5 text-xs font-medium text-white/55">
							কোনো কার্ড লাগবে না · কোনো commitment নেই
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
