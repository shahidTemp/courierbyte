import { Pencil, ShieldCheck } from "lucide-react";
import { formateDate } from "@/utils/formateDate";

type AdminRow = {
	_id: string;
	name: string;
	number: string;
	isActive: boolean;
	createdAt: string;
};

type AdminTableProps = {
	data: AdminRow[];
	onEditItem: (id: string) => void;
	searchTerm?: string;
};

export default function AdminTable({
	data,
	onEditItem,
	searchTerm = "",
}: AdminTableProps) {
	if (!data.length) {
		return (
			<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center">
				<ShieldCheck className="mb-4 size-12 text-secondary/35" />
				<h2 className="text-xl font-extrabold text-secondary-dark">
					No administrators found
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					{searchTerm
						? "Try a different search term."
						: "Create your first administrator to get started."}
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[700px] border-collapse">
					<thead>
						<tr className="bg-secondary text-left text-sm text-white">
							{["Sl.", "Administrator", "Number", "Status", "Created", "Action"].map(
								(heading) => (
									<th className="px-5 py-4 font-bold" key={heading}>
										{heading}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{data.map((admin, index) => (
							<tr
								className="border-b border-slate-100 transition hover:bg-emerald-50/40 last:border-0"
								key={admin._id}
							>
								<td className="px-5 py-4 text-sm text-slate-500">{index + 1}</td>
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-secondary">
											{String(admin.name ?? "A").charAt(0).toUpperCase()}
										</span>
										<span className="font-bold text-secondary-dark">{admin.name}</span>
									</div>
								</td>
								<td className="px-5 py-4 text-sm text-slate-600">{admin.number}</td>
								<td className="px-5 py-4">
									<span
										className={`rounded-full px-3 py-1 text-xs font-bold ${admin.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
									>
										{admin.isActive ? "Active" : "Inactive"}
									</span>
								</td>
								<td className="px-5 py-4 text-sm text-slate-500">
									{formateDate(admin.createdAt)}
								</td>
								<td className="px-5 py-4">
									<button
										type="button"
										onClick={() => onEditItem(admin._id)}
										className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
									>
										<Pencil className="size-3.5" /> Edit
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
