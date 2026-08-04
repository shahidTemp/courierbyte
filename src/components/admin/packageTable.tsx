import { Check, Package, Pencil } from "lucide-react";

type PackageRow = {
	_id: string;
	name: string;
	description: string;
	price: number;
	yearly_price: number;
	duration_in_days: number;
	api_call_limit: number;
	features: string[];
	is_active: boolean;
};

type PackageTableProps = {
	data: PackageRow[];
	onEditItem: (id: string) => void;
	searchTerm?: string;
};

export default function PackageTable({
	data,
	onEditItem,
	searchTerm = "",
}: PackageTableProps) {
	if (!data.length) {
		return (
			<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center">
				<Package className="mb-4 size-12 text-secondary/35" />
				<h2 className="text-xl font-extrabold text-secondary-dark">No packages found</h2>
				<p className="mt-1 text-sm text-slate-500">
					{searchTerm
						? "Try a different search term."
						: "Add a package to populate your catalog."}
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-5 xl:grid-cols-2">
			{data.map((item) => (
				<article
					className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/10"
					key={item._id}
				>
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="mb-2 flex items-center gap-2">
								<span
									className={`size-2 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-300"}`}
								/>
								<span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
									{item.is_active ? "Active plan" : "Inactive plan"}
								</span>
							</div>
							<h2 className="text-2xl font-extrabold text-secondary-dark">{item.name}</h2>
							<p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
						</div>
						<button
							type="button"
							aria-label={`Edit ${item.name}`}
							onClick={() => onEditItem(item._id)}
							className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
						>
							<Pencil className="size-3.5" /> Edit
						</button>
					</div>
					<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
						<Metric label="Monthly" value={`৳${item.price}`} />
						<Metric label="Yearly" value={`৳${item.yearly_price}`} />
						<Metric label="Duration" value={`${item.duration_in_days} days`} />
						<Metric label="API limit" value={Number(item.api_call_limit).toLocaleString()} />
					</div>
					<div className="mt-5 border-t border-slate-100 pt-4">
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
							Included features
						</p>
						<ul className="grid gap-2 sm:grid-cols-2">
							{item.features.map((feature, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: package feature rows are position-controlled
								<li className="flex items-start gap-2 text-sm text-slate-600" key={`${item._id}-feature-${index}`}>
									<Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
									{feature}
								</li>
							))}
						</ul>
					</div>
				</article>
			))}
		</div>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-slate-50 px-3 py-2.5">
			<p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
			<p className="mt-1 font-extrabold text-secondary-dark">{value}</p>
		</div>
	);
}
