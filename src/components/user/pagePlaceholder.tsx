import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Sparkles } from "lucide-react";

type PagePlaceholderProps = {
	icon: LucideIcon;
	title: string;
	titleBn: string;
	description: string;
	features: string[];
};

export function PagePlaceholder({
	icon: Icon,
	title,
	titleBn,
	description,
	features,
}: PagePlaceholderProps) {
	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-3xl">
				<div className="relative overflow-hidden rounded-2xl border border-secondary/10 bg-white shadow-sm">
					{/* decorative glows */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 overflow-hidden"
					>
						<div className="absolute -left-12 -top-14 h-44 w-44 rounded-full bg-secondary/10 blur-2xl" />
						<div className="absolute -bottom-16 -right-10 h-44 w-44 rounded-full bg-secondary/5 blur-2xl" />
					</div>
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

					<div className="relative p-6 sm:p-8">
						{/* header */}
						<div className="flex flex-wrap items-center gap-4">
							<span
								aria-hidden="true"
								className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/25"
							>
								<Icon className="h-7 w-7" />
							</span>
							<div className="min-w-0 flex-1">
								<h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
									{title}
								</h1>
								<p className="mt-1 text-sm font-semibold text-secondary/70">
									{titleBn}
								</p>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/5 px-3 py-1.5 text-xs font-bold text-secondary">
								<Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
								শীঘ্রই আসছে
							</span>
						</div>

						<p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
							{description}
						</p>

						<div className="my-6 h-px bg-secondary/10" />

						{/* planned features */}
						<ul className="grid gap-3 sm:grid-cols-2">
							{features.map((feature) => (
								<li
									key={feature}
									className="flex items-start gap-2.5 rounded-xl border border-secondary/10 bg-secondary/5 px-4 py-3.5 text-sm font-medium text-secondary-dark"
								>
									<CheckCircle2
										aria-hidden="true"
										className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
									/>
									{feature}
								</li>
							))}
						</ul>

						<p className="mt-6 text-xs font-medium text-slate-400">
							এটি একটি placeholder পেজ — সম্পূর্ণ ফিচার শীঘ্রই যোগ করা হবে।
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
