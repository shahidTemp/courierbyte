// @ts-nocheck
import { ArrowRight, Search, Zap } from "lucide-react";

export default function FinalCta() {
	return (
		<section id="contact" className="pb-20 sm:pb-28">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night px-6 py-14 text-center shadow-2xl shadow-black/40 sm:px-12">
					<div
						aria-hidden
						className="absolute -left-20 -top-32 h-80 w-80 rounded-full bg-accent/[0.06] blur-3xl"
					/>
					<div
						aria-hidden
						className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl"
					/>
					<div className="relative">
						<span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent">
							<Zap className="h-3.5 w-3.5" /> আজই প্রথম যাচাই করুন
						</span>
						<h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
							আপনার পরের COD অর্ডারটি
							<br />
							অনুমানের ওপর ছেড়ে দেবেন না
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
							প্রতিদিনের ৫টি বিনামূল্যের যাচাই দিয়ে শুরু করুন। কুরিয়ারবাইট আপনার লাভ রক্ষায় কতটা
							সাহায্য করতে পারে, নিজেই দেখে নিন।
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<a
								href="#hero"
								className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent-strong"
							>
								<Search className="h-4 w-4" /> বিনামূল্যে যাচাই শুরু করুন
							</a>
							<a
								href="#pricing"
								className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.02] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.06]"
							>
								প্যাকেজ দেখুন <ArrowRight className="h-4 w-4" />
							</a>
						</div>
						<p className="mt-5 text-xs font-medium text-white/55">
							কোনো কার্ড লাগবে না · কোনো বাধ্যবাধকতা নেই
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
